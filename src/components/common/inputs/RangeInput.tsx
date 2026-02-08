import { type ChangeEvent, type ReactNode } from 'react';
import { FieldWrapper } from './FieldWrapper';
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
    tooltip,
    defaultValue,
    allowClear = true,
}: RangeInputProps) {
    const isModified =
        allowClear &&
        defaultValue !== undefined &&
        value !== undefined &&
        value !== defaultValue;

    const handleReset = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (defaultValue === undefined || !onChange) {
            return;
        }

        onChange({
            target: { value: String(defaultValue) },
        } as ChangeEvent<HTMLInputElement>);
    };

    return (
        <FieldWrapper
            label={label}
            onReset={handleReset}
            showReset={isModified}
            tooltip={tooltip}
        >
            <div className="flex items-center gap-2 w-full">
                <input
                    className={`range ${highlightRangeStyle} ${className}`}
                    max={max}
                    min={min}
                    onChange={onChange}
                    step={step}
                    type="range"
                    value={value}
                />
                {numberInput && (
                    <>
                        <NumberInput
                            label=""
                            max={max}
                            onChange={onChange}
                            value={value}
                        />
                    </>
                )}
            </div>
        </FieldWrapper>
    );
}

const highlightRangeStyle = 'hover:range-accent focus:range-accent';

type RangeInputProps = {
    label: string;
    numberInput?: boolean;
    value?: number;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    max?: number;
    min?: number;
    step?: number;
    className?: string;
    tooltip?: {
        icon?: ReactNode;
        content: ReactNode;
    };
    defaultValue?: number;
    allowClear?: boolean;
};

export default RangeInput;
