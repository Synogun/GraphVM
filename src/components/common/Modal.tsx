import React, { useEffect, useRef } from 'react';

export function Modal({ id, title, children, show, onClose, actions }: ModalProps) {
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
        <dialog ref={ modalRef } className='modal' id={ id }>
            <div className='modal-box'>
                <h3 className='font-bold text-lg'>{title ?? ' '}</h3>
                <div className='py-4'>{children ?? ' '}</div>
                <div className='modal-action'>
                    {actions}
                    <form method='dialog'>
                        <button className='btn'>Close</button>
                    </form>
                </div>
            </div>
            <form className='modal-backdrop' method='dialog'>
                <button>close</button>
            </form>
        </dialog>
    );
}

type ModalProps = {
    id: string;
    title?: string;
    children?: React.ReactNode;
    show?: boolean;
    onClose?: () => void;
    actions?: React.ReactNode;
};

export default Modal;

