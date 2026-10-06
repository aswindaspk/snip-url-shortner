export let isRedisAvailable: boolean = false;
export let isCuckooFilterAvailable: boolean = false;

export function setRedisAvailability(status: boolean) {
    isRedisAvailable = status;
}

export function setCuckooFilterAvailability(status: boolean) {
    isCuckooFilterAvailable = status;
}