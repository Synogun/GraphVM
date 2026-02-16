import {
    type ChangeEvent,
    type ReactNode,
    useCallback,
    useRef,
    useState,
} from 'react';
import { AppIcons } from '../AppIcons';
import { FieldWrapper } from './FieldWrapper';

export function ToggleInput({
    label,
    checked,
    onChange,
    className = '',
    tooltip,
    allowClear = true,
    defaultValue,
}: ToggleInputProps) {
    const isModified =
        allowClear &&
        defaultValue !== undefined &&
        checked !== undefined &&
        checked !== defaultValue;

    const [flashText, setFlashText] = useState<string | null>(null);
    const flashTimer = useRef<ReturnType<typeof setTimeout>>(null);

    const triggerFlash = useCallback((newChecked: boolean) => {
        if (flashTimer.current) {
            clearTimeout(flashTimer.current);
        }
        setFlashText(newChecked ? 'Activated' : 'Deactivated');
        flashTimer.current = setTimeout(() => {
            setFlashText(null);
        }, 1200);
    }, []);

    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            triggerFlash(e.target.checked);
            onChange?.(e);
        },
        [onChange, triggerFlash]
    );

    const handleReset = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (defaultValue === undefined || !onChange) {
            return;
        }

        triggerFlash(defaultValue);
        onChange({
            target: { checked: defaultValue },
        } as ChangeEvent<HTMLInputElement>);
    };

    return (
        <FieldWrapper
            label={label}
            onReset={handleReset}
            showReset={isModified}
            tooltip={tooltip}
        >
            <label className={`label gap-2`}>
                <label className={`toggle toggle-xl ${highlightStyle}`}>
                    <input
                        type="checkbox"
                        className={className}
                        checked={checked}
                        onChange={handleChange}
                    />
                    <AppIcons.Close size={'1.7em'} aria-label="enabled" />
                    <AppIcons.Checkmark
                        size={'1.4em'}
                        className="absolute inset-0 m-auto"
                        aria-label="disabled"
                    />
                </label>
                {flashText && (
                    <span
                        key={flashText}
                        className={`text-xs font-semibold animate-flash-fade ${
                            flashText === 'Activated' ? 'text-accent' : ''
                        }`}
                    >
                        {flashText}
                    </span>
                )}
            </label>
        </FieldWrapper>
    );
}

const highlightStyle = 'hover:input-accent focus:input-accent';
type ToggleInputProps = {
    label: string;
    checked?: boolean;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    tooltip?: {
        icon?: ReactNode;
        content: ReactNode;
    };
    defaultValue?: boolean;
    allowClear?: boolean;
};
