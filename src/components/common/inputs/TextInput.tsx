import React, { ChangeEvent } from 'react';

function TextInput({ label, value, onChange, className='' }: TextInputProps) {
    return (
        <fieldset className='fieldset'>
            {label && <legend className='fieldset-legend'>{label}</legend>}
            <input
                className={ `p-1 border rounded input hover:input-accent ${className}` }
                onChange={ onChange }
                type='text'
                value={ value }
            />
        </fieldset>
    );
}

type TextInputProps = {
    label?: string;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    className?: string;
};

export default TextInput;
