let keyId = 0;

export function getUniqueKey() {
    return ++keyId;
}

export function refreshKeyId() {
    keyId = 0;
}