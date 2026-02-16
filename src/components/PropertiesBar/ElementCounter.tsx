import { type CSSProperties } from 'react';

function ElementCounter({ label, value }: ElementCounterProps) {
    return (
        <div className="flex flex-col px-4 py-2 border-2 rounded-box text-base-content">
            <span className="font-bold">{label}</span>
            <span className="countdown font-mono text-2xl justify-center">
                <span
                    aria-label="counter"
                    aria-live="polite"
                    style={
                        {
                            '--value': value,
                        } as CSSProperties
                    }
                >
                    {value}
                </span>
            </span>
        </div>
    );
}

type ElementCounterProps = {
    label: string;
    value: number;
};

export default ElementCounter;
