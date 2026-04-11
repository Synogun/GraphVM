import { App } from '@/App';
import { ErrorBoundary } from '@/components/feedback';
import { ModalsProvider, SettingsProvider, ToastsProvider } from '@/providers';
import '@/styles';
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
            <SettingsProvider>
                <ToastsProvider>
                    <ModalsProvider>
                        <App />
                    </ModalsProvider>
                </ToastsProvider>
            </SettingsProvider>
        </ErrorBoundary>
    </StrictMode>
);

createRoot(rootElement).render(appTree);
