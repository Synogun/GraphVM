import { type ChangeEvent } from 'react';
import { AppIcons } from '../AppIcons';

function ColorInput({
    label,
    value,
    onChange,
    className = '',
}: ColorInputProps) {
    return (
        <fieldset className="fieldset">
            {label && <legend className="fieldset-legend">{label}</legend>}
            <label className="input hover:input-accent focus:input-accent cursor-pointer">
                {paletteIcon}
                <input
                    className={`p-2 border-0 rounded bg-transparent cursor-pointer ${className}`}
                    onChange={onChange}
                    type="color"
                    value={value}
                />
            </label>
        </fieldset>
    );
}

const paletteIcon = (
    <AppIcons.ColorPalette className="opacity-50" size="1.5em" />
);

type ColorInputProps = {
    label?: string;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    className?: string;
};

export default ColorInput;
