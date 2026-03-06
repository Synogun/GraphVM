import { AppIcons } from '@/components/common/AppIcons';
import { Logger } from '@Logger';
import type { ReactNode } from 'react';
import { Component } from 'react';

const logger = Logger.createContextLogger('ErrorBoundary');

type ErrorBoundaryProps = {
    children: ReactNode;
    onReset?: () => void;
    fallback?: (props: ErrorBoundaryFallbackProps) => ReactNode;
};

type ErrorBoundaryState = {
    hasError: boolean;
};

type ErrorBoundaryFallbackProps = {
    onReset: () => void;
};

function DefaultFallback({ onReset }: ErrorBoundaryFallbackProps) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-base-100 p-4 text-base-content">
            <div className="card w-full max-w-2xl bg-base-200 shadow-xl">
                <div className="card-body gap-4 p-8 sm:p-10">
                    <div className="flex items-center gap-3">
                        <AppIcons.Close
                            className="text-error"
                            size={30}
                            title="Error"
                        />
                        <h2 className="card-title text-2xl">Something went wrong</h2>
                    </div>
                    <p className="text-base-content/70">
                        The app hit an unexpected error and stopped rendering.
                    </p>
                    <p className="text-sm text-base-content/60">
                        You can recover by reloading the app. Your latest unsaved
                        changes might be lost.
                    </p>
                    <div className="card-actions mt-2 justify-end">
                        <button
                            className="btn btn-primary"
                            onClick={onReset}
                            type="button"
                        >
                            Reload App
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

class ErrorBoundaryImpl extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    public constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    public static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    public componentDidCatch(error: unknown, info: unknown) {
        logger.error('Unhandled error in component tree', error, info);
    }

    private handleReset = () => {
        this.setState({ hasError: false });
        if (this.props.onReset) {
            this.props.onReset();
            return;
        }
        window.location.reload();
    };

    public render(): ReactNode {
        if (this.state.hasError) {
            const Fallback = this.props.fallback;
            if (Fallback) {
                return <Fallback onReset={this.handleReset} />;
            }

            return <DefaultFallback onReset={this.handleReset} />;
        }

        return this.props.children;
    }
}

export function ErrorBoundary(props: ErrorBoundaryProps) {
    return <ErrorBoundaryImpl {...props} />;
}
