import { slidingRateLimiter } from "../middlewares/rateLimiter.middleware.js";

export const createUrlRateLimiter = slidingRateLimiter({limit: 10, windowInSeconds: 60, keyPrefix :"createUrl"})