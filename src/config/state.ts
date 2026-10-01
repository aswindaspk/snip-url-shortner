export let isRedisAvailable: boolean = false;
export let isBloomFilterAvailable: boolean = false;

export function setRedisAvailability(status: boolean) {
    isRedisAvailable = status;
}

export function setBloomFilterAvailability(status: boolean) {
    isBloomFilterAvailable = status;
}