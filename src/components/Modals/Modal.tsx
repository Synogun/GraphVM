import React, { useEffect, useRef } from 'react';

export function Modal({
    id,
    title,
    subtitle,
    children,
    show,
    onClose,
    actions,
    className,
}: ModalProps) {
    const modalRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const modal = modalRef.current;
        if (!modal) return;

        if (show) {
            modal.showModal();
        } else {
            modal.close();
        }
    }, [show]);

    useEffect(() => {
        const modal = modalRef.current;
        if (!modal) return;

        const handleClose = () => {
            if (show) {
                onClose?.();
            }
        };

        modal.addEventListener('close', handleClose);

        return () => {
            modal.removeEventListener('close', handleClose);
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
        };
    }, [onClose, show]);

    return (
        <dialog ref={modalRef} className={`modal ${className ?? ''}`} id={id}>
            <div className="modal-box max-h-[90vh] max-w-[70vw] overflow-y-auto overflow-x-hidden">
                <h3 className="font-bold text-lg text-center">{title ?? ' '}</h3>
                {subtitle && (
                    <p className="text-sm text-center text-base-content/70 mt-1">
                        {subtitle}
                    </p>
                )}
                <div className="pt-2 pb-2">{children ?? ' '}</div>
                <div className="modal-action mt-2">
                    {actions ?? (
                        <form method="dialog">
                            <button className="btn" onClick={onClose}>
                                Close
                            </button>
                        </form>
                    )}
                </div>
            </div>
            <form className="modal-backdrop" method="dialog">
                <button onClick={onClose}>close</button>
            </form>
        </dialog>
    );
}

type ModalProps = {
    id: string;
    title?: string;
    subtitle?: string;
    children?: React.ReactNode;
    show?: boolean;
    onClose?: () => void;
    actions?: React.ReactNode;
    className?: string;
};
