import { Logger } from '@Logger';
import LZString from 'lz-string';

const logger = Logger.createContextLogger('lzStorage');

export function lzSave(key: string, value: unknown): void {
    try {
        localStorage.setItem(key, LZString.compressToBase64(JSON.stringify(value)));
    } catch (error) {
        logger.warn(`Failed to save to storage for key "${key}"`, error);
    }
}

export function lzLoad(key: string): unknown {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const decompressed = LZString.decompressFromBase64(raw);
        if (!decompressed) return null;
        return JSON.parse(decompressed) as unknown;
    } catch (error) {
        logger.warn(`Failed to load from storage for key "${key}"`, error);
        return null;
    }
}
