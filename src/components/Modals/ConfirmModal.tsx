import { Modal } from './Modal';

export function ConfirmModal({
    id,
    show,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
    confirmButtonClassName = 'btn-primary',
}: ConfirmModalProps) {
    return (
        <Modal
            id={id}
            title={title}
            show={show}
            onClose={onCancel}
            boxClassName="w-[min(92vw,24rem)] max-w-[24rem]"
            children={
                <p className="text-sm text-center text-base-content/70 whitespace-pre-line">
                    {message}
                </p>
            }
            actions={
                <>
                    <button
                        className="btn btn-ghost btn-sm"
                        type="button"
                        onClick={onCancel}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        className={`btn btn-sm ${confirmButtonClassName}`}
                        type="button"
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </>
            }
        />
    );
}

type ConfirmModalProps = {
    id: string;
    show: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmButtonClassName?: string;
};
