// Copyright © 2024 OpenProtectAI. All Rights Reserved.

// A utility for hashing strings using the browser's native, asynchronous Web Crypto API.
export async function sha256(str: string): Promise<string> {
    const buffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}