import type { ToastData } from '@/types/popups';

type Jsonable =
    | string
    | number
    | boolean
    | null
    | undefined
    | readonly Jsonable[]
    | { readonly [key: string]: Jsonable }
    | { toJSON(): Jsonable };

export class ParsedError extends Error {
    public readonly context?: Jsonable;

    constructor(
        message: string,
        options: { cause?: Error; context?: Jsonable } = {}
    ) {
        const { cause, context } = options;
        super(message, { cause });
        this.context = context;
    }
}

export function parseError(error: unknown, context?: Jsonable): ParsedError {
    if (error instanceof Error) {
        return new ParsedError(error.message, { cause: error, context });
    }
    return new ParsedError(String(error), { context });
}

export const ParsedErrorToastEnum: Record<string, Omit<ToastData, 'id'>> = {
    GraphNotFound: { type: 'error', message: 'Graph instance not found.' },
};
