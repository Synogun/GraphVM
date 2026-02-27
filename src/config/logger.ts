import { isDev } from '../utils/general';

/**
 * Logger utility for logging messages with different levels and contexts.
 *
 * Usage:
 * ---
 * const logger = Logger.createContextLogger('MyContext');
 * logger.info('This is an info message');
 * logger.error('This is an error message', errorObject);
 */
export const Logger = {
    /**
     * Enable or disable timestamps in log messages.
     */
    timestamps: true,

    /**
     * Array to store log entries.
     */
    logs: [] as string[],

    _capLogs: () => {
        const maxLogs = 5000;

        if (Logger.logs.length > maxLogs) {
            const numToRemove = Logger.logs.length - maxLogs;
            for (let i = 0; i < numToRemove; i++) {
                Logger.logs.shift();
            }
        }
    },

    /**
     * Get the current timestamp formatted as ISO string.
     * @returns The formatted timestamp string.
     */
    _getTimestamp: (): string => {
        return Logger.timestamps ? `[${new Date().toISOString()}] ` : '';
    },

    /**
     * Store a log entry with the given level, context, message, and arguments.
     * @param level - level of the log (e.g., DEBUG, INFO, WARN, ERROR)
     * @param context - the context or source of the log message
     * @param message - the log message
     * @param args - additional arguments to include in the log
     */
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

        const logEntry =
            `[${timestamp}] [${level}] [${context}] ${message} ${argsStr}`.trim();
        Logger.logs.push(logEntry);
        Logger._capLogs();
    },

    /**
     * Download the accumulated logs as a text file.
     */
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

    /**
     * Create a logger scoped to a specific context.
     * @param context - the context or source for the logger
     * @returns An object with logging methods scoped to the given context.
     */
    createContextLogger: (context: string) => {
        return {
            /**
             * Log a debug message within the specified context.
             * @param message - the log message
             * @param args - additional arguments to include in the log
             */
            debug: (message: string, ...args: unknown[]) => {
                Logger.debug(context, message, ...args);
            },

            /**
             * Log an info message within the specified context.
             * @param message - the log message
             * @param args - additional arguments to include in the log
             */
            info: (message: string, ...args: unknown[]) => {
                Logger.info(context, message, ...args);
            },

            /**
             * Log a warning message within the specified context.
             * @param message - the log message
             * @param args - additional arguments to include in the log
             */
            warn: (message: string, ...args: unknown[]) => {
                Logger.warn(context, message, ...args);
            },

            /**
             * Log an error message within the specified context.
             * @param message - the log message
             * @param args - additional arguments to include in the log
             */
            error: (message: string, ...args: unknown[]) => {
                Logger.error(context, message, ...args);
            },
        };
    },

    /**
     * Log a debug message.
     * @param context - the context or source of the log message
     * @param message - the log message
     * @param args - additional arguments to include in the log
     */
    debug: (context: string, message: string, ...args: unknown[]) => {
        Logger._store('DEBUG', context, message, args);
        if (isDev()) {
            console.debug(
                `${Logger._getTimestamp()}[DEBUG] [${context}] ${message}`,
                ...args
            );
        }
    },

    /**
     * Log an info message.
     * @param context - the context or source of the log message
     * @param message - the log message
     * @param args - additional arguments to include in the log
     */
    info: (context: string, message: string, ...args: unknown[]) => {
        Logger._store('INFO', context, message, args);
        console.info(
            `${Logger._getTimestamp()}[INFO] [${context}] ${message}`,
            ...args
        );
    },

    /**
     * Log a warning message.
     * @param context - the context or source of the log message
     * @param message - the log message
     * @param args - additional arguments to include in the log
     */
    warn: (context: string, message: string, ...args: unknown[]) => {
        Logger._store('WARN', context, message, args);
        console.warn(
            `${Logger._getTimestamp()}[WARN] [${context}] ${message}`,
            ...args
        );
    },

    /**
     * Log an error message.
     * @param context - the context or source of the log message
     * @param message - the log message
     * @param args - additional arguments to include in the log
     */
    error: (context: string, message: string, ...args: unknown[]) => {
        Logger._store('ERROR', context, message, args);
        console.error(
            `${Logger._getTimestamp()}[ERROR] [${context}] ${message}`,
            ...args
        );
    },
};
