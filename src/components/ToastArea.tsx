import { useToasts } from '@/contexts/PopupsContext';
import { useSettings } from '@/contexts/SettingsContext';
import { AppIcons } from './common/AppIcons';

const PositionsMap = {
    'top-left': 'toast-top toast-start',
    'top-center': 'toast-top toast-center',
    'top-right': 'toast-top toast-end',
    'center-left': 'toast-middle toast-start',
    'center-center': 'toast-middle toast-center',
    'center-right': 'toast-middle toast-end',
    'bottom-left': 'toast-bottom toast-start',
    'bottom-center': 'toast-bottom toast-center',
    'bottom-right': 'toast-bottom toast-end',
};

const IconMap = {
    success: <AppIcons.Checkmark size={24} />,
    error: <AppIcons.Close size={24} />,
    warning: <AppIcons.Warning size={24} />,
    info: <AppIcons.Info size={24} />,
};

const StyleMap = {
    success: 'bg-accent text-accent-content',
    error: 'alert-error',
    warning: 'alert-warning',
    info: 'border-accent',
};

export function ToastArea() {
    const {
        ui: { toast },
    } = useSettings();

    const { pool: toastPool, removeToast } = useToasts();

    return (
        <div className={`toast ${PositionsMap[toast.position]} z-100`}>
            {toastPool.map((toast) => {
                const toastType = toast.type ?? 'info';
                const toastIcon = toast.icon ?? IconMap[toastType];
                const toastTitle =
                    toast.title ??
                    toastType.charAt(0).toUpperCase() + toastType.slice(1);

                return (
                    <div
                        key={toast.id}
                        role="alert"
                        className={`alert ${StyleMap[toastType]} alert-vertical sm:alert-horizontal`}
                        onClick={() => {
                            removeToast(toast.id);
                        }}
                    >
                        {toastIcon}
                        <div>
                            <h3 className="font-bold">{toastTitle}</h3>
                            <div className="text-xs">{toast.message}</div>
                        </div>
                        {/* TODO: Possible actions prop support later on  */}
                        {/* <button className="btn btn-sm">See</button> */}
                    </div>
                );
            })}
        </div>
    );
}
