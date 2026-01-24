import { isDev } from './general';

export const Logger = {
    timestamps: true,
    logs: [] as string[],

    _getTimestamp: (): string => {
        return Logger.timestamps ? `[${new Date().toISOString()}] ` : '';
    },

    _store: (level: string, context: string, message: string, args: unknown[]) => {
        const timestamp = new Date().toISOString();
        const argsStr = args
            .map((arg) => {
                try {
                    switch (typeof arg) {
                        case 'string':
                            return arg;

                        case 'number':
                        case 'boolean':
                            return String(arg);
                        case 'object':
                            return arg === null ? 'null' : JSON.stringify(arg);

                        case 'undefined':
                            return 'undefined';

                        default:
                            break;
                    }
                } catch {
                    return '[Unserializable]';
                }
            })
            .join(' ');

        const logEntry = `[${timestamp}] [${level}] [${context}] ${message} ${argsStr}`.trim();
        Logger.logs.push(logEntry);
    },

    downloadLogs: () => {
        const content = Logger.logs.join('\n');
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `graphvm_session_${new Date().toISOString().replace(/[:.]/g, '-')}.log`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
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
        Logger._store('DEBUG', context, message, args);
        if (isDev()) {
            console.debug(`${Logger._getTimestamp()}[DEBUG] [${context}] ${message}`, ...args);
        }
    },

    info: (context: string, message: string, ...args: unknown[]) => {
        Logger._store('INFO', context, message, args);
        console.info(`${Logger._getTimestamp()}[INFO] [${context}] ${message}`, ...args);
    },

    warn: (context: string, message: string, ...args: unknown[]) => {
        Logger._store('WARN', context, message, args);
        console.warn(`${Logger._getTimestamp()}[WARN] [${context}] ${message}`, ...args);
    },

    error: (context: string, message: string, ...args: unknown[]) => {
        Logger._store('ERROR', context, message, args);
        console.error(`${Logger._getTimestamp()}[ERROR] [${context}] ${message}`, ...args);
    },
};
