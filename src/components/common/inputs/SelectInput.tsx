import { type ChangeEvent } from 'react';

function SelectInput({ value, options, label, selectTitle, onChange, className='' }: SelectInputProps) {
    return (
        <fieldset className='fieldset'>
            {label && <legend className='fieldset-legend'>{label}</legend>}
            <select
                className={ `select hover:select-accent focus:select-accent cursor-pointer ${className}` }
                onChange={ onChange }
                value={ value }
            >
                {selectTitle && <>
                    <option
                        key={ selectTitle.replace(' ', '-') + '-' + 'type-dropdown-title' }
                        disabled={ true }
                    >
                        {selectTitle}
                    </option>
                </>}

                {options.map(option => (
                    <option
                        key={ option.label.replace(' ', '-') + '-' + option.value }
                        value={ option.value }
                    >
                        {option.label}
                    </option>
                ))}
            </select>
        </fieldset>
    );
}

type SelectInputProps = {
    label?: string;
    selectTitle?: string;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[];
    className?: string;
};

export default SelectInput;
