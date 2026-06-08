import { App } from '@/App';
import { ErrorBoundary } from '@/components/feedback';
import '@/styles';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { importCytoscapeExtensions } from './config/extensions';
import { AppProviders } from './providers';

importCytoscapeExtensions();

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('Root element with id "root" not found');
}

const appTree = (
    <StrictMode>
        <ErrorBoundary>
            <AppProviders>
                <App />
            </AppProviders>
        </ErrorBoundary>
    </StrictMode>
);

createRoot(rootElement).render(appTree);
