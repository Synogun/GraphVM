import { type ChangeEvent } from 'react';
import NumberInput from './NumberInput';

function RangeInput({
    label,
    numberInput = true,
    value,
    onChange,
    max,
    min,
    step,
    className = '',
}: RangeInputProps) {
    return (
        <fieldset className="fieldset">
            {label && <legend className="fieldset-legend">{label}</legend>}
            <div className="flex items-center gap-2">
                <input
                    className={`range hover:range-accent focus:range-accent ${className}`}
                    max={max}
                    min={min}
                    onChange={onChange}
                    step={step}
                    type="range"
                    value={value}
                />
                {numberInput && (
                    <>
                        <NumberInput max={max} onChange={onChange} value={value} />
                        {/* <input
                        className='w-25 p-1 text-center input hover:input-accent focus:input-accent'
                        max={ max }
                        min={ min }
                        onChange={ onChange }
                        step={ step }
                        type='number'
                        value={ value }
                    /> */}
                    </>
                )}
            </div>
        </fieldset>
    );
}

type RangeInputProps = {
    label?: string;
    numberInput?: boolean;
    value?: number;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    max?: number;
    min?: number;
    step?: number;
    className?: string;
};

export default RangeInput;
