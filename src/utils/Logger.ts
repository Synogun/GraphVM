import { isDev } from './general';

export const Logger = {
    timestamps: true,

    _getTimestamp: (): string => {
        return Logger.timestamps ? `[${new Date().toISOString()}] ` : '';
    },

    createContextLogger: (context: string) => {
        return {
            debug: (message: string, ...args: unknown[]) => {
                Logger.debug(context, message, ...args);
            },

            info: (message: string, ...args: unknown[]) => {
                Logger.info(context, message, ...args);
            },

            warn: (message: string, ...args: unknown[]) => {
                Logger.warn(context, message, ...args);
            },

            error: (message: string, ...args: unknown[]) => {
                Logger.error(context, message, ...args);
            },
        };
    },

    debug: (context: string, message: string, ...args: unknown[]) => {
        if (isDev()) {
            console.debug(`${Logger._getTimestamp()}[DEBUG] [${context}] ${message}`, ...args);
        }
    },

    info: (context: string, message: string, ...args: unknown[]) => {
        console.info(`${Logger._getTimestamp()}[INFO] [${context}] ${message}`, ...args);
    },

    warn: (context: string, message: string, ...args: unknown[]) => {
        console.warn(`${Logger._getTimestamp()}[WARN] [${context}] ${message}`, ...args);
    },

    error: (context: string, message: string, ...args: unknown[]) => {
        console.error(`${Logger._getTimestamp()}[ERROR] [${context}] ${message}`, ...args);
    },
};
