import { type ChangeEvent } from 'react';

function NumberInput({
    label,
    value,
    onChange,
    max,
    min,
    step,
    className = '',
}: NumberInputProps) {
    return (
        <fieldset className="fieldset">
            {label && <legend className="fieldset-legend">{label}</legend>}
            <input
                className={`w-25 input p-1 text-center hover:input-accent focus:input-accent ${className}`}
                max={max}
                min={min}
                onChange={onChange}
                step={step}
                type="number"
                value={value}
            />
        </fieldset>
    );
}

type NumberInputProps = {
    label?: string;
    value?: number;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    max?: number;
    min?: number;
    step?: number;
    className?: string;
};

export default NumberInput;
