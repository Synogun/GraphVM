import { App } from '@/App';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ModalsProvider } from '@/providers/ModalsProvider';
import { ToastsProvider } from '@/providers/ToastsProvider';
import '@/styles/animations.css';
import '@/styles/main.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { importCytoscapeExtensions } from './config/extensions';
import { ParsedError } from './config/parsedError';

importCytoscapeExtensions();

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new ParsedError('Root element with id "root" not found');
}

const appTree = (
    <StrictMode>
        <ErrorBoundary>
            <ToastsProvider>
                <ModalsProvider>
                    <App />
                </ModalsProvider>
            </ToastsProvider>
        </ErrorBoundary>
    </StrictMode>
);

createRoot(rootElement).render(appTree);
