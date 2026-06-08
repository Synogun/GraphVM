import type { SharePayload } from '@/types/workspace';
import { isSharePayload } from '@/types/workspace/typeGuards';
import LZString from 'lz-string';

export function encodeSharePayload(payload: SharePayload): string {
    return LZString.compressToEncodedURIComponent(JSON.stringify(payload));
}

export function decodeSharePayload(encoded: string): SharePayload | null {
    try {
        const decompressed = LZString.decompressFromEncodedURIComponent(encoded);
        if (!decompressed) {
            return null;
        }
        const parsed: unknown = JSON.parse(decompressed);
        return isSharePayload(parsed) ? parsed : null;
    } catch {
        return null;
    }
}

export function buildShareUrl(encoded: string): string {
    return `${window.location.origin}${window.location.pathname}?share=${encoded}`;
}

export function getShareParam(): string | null {
    return new URLSearchParams(window.location.search).get('share');
}
