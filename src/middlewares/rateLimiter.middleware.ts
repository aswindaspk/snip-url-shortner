import type { NextFunction, Request, Response } from "express";
import { redis } from "../config/infra/redis/redis.js";

const SLIDING_WINDOW_SCRIPT = `
    local windowInSeconds = tonumber(ARGV[1])
    -- use redis time so API instances share same clock
    local time = redis.call("TIME")
    local now = tonumber(time[1]) + tonumber(time[2]) / 1000000

    -- this also gets us the time window we are in
    local windowId = math.floor(now / windowInSeconds)
    local elapsedTime = now - windowId * windowInSeconds
    
    local currentKey = KEYS[1] .. ":" .. windowId
    local previousKey = KEYS[1] .. ":" .. (windowId - 1)
    
    -- Count this req in current window
    local currentCount = redis.call("INCR", currentKey)
    
    if currentCount == 1 then
        redis.call("EXPIRE", currentKey, windowInSeconds * 2)
    end
    
    local previousCount = tonumber(redis.call("GET", previousKey) or "0")
    
    -- weight the previous window by remaining time of current window
    local previousWeight = (windowInSeconds - elapsedTime) / windowInSeconds
    local estimatedCount = (previousCount * previousWeight) + currentCount
    local retryAfter = math.ceil(windowInSeconds - elapsedTime)
    return {estimatedCount,retryAfter}`;

interface RateLimiterOptions {
    limit: number,
    windowInSeconds: number,
    keyPrefix: string
}

export function slidingRateLimiter({limit, windowInSeconds, keyPrefix}: RateLimiterOptions) {
     
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const identity = req.user?.id ?? req.ip ?? "unknown"
        const key = `${keyPrefix}:${identity}`

        try {
            const [estimatedCountRaw,retryAfterRaw] = (await redis.call("EVAL", SLIDING_WINDOW_SCRIPT, "1", key, String(windowInSeconds), String(limit))) as [number | string, number | string]
            const estimatedCount = Number(estimatedCountRaw);
            const retryAfter = Number(retryAfterRaw);
            res.setHeader("RateLimit-Limit", limit)
            res.setHeader("RateLimit-Remaining", Math.floor(limit - estimatedCount))

            if(estimatedCount > limit) {
                console.log('Potential spam, RL hit limit')
                res.setHeader("Retry-After", retryAfter)
                res.status(429).json(
                    {
                        status: "fail",
                        message: "Too many requests. Try again after some time."
                    }
                );
                return;
            }
            next();
        }
        catch(err){
            console.log("Rate limiter Redis error:", err)
            res.status(503).json(
                {
                    status: "fail",
                    message: "internal Server Error"
                }
            );
        }

    }
}