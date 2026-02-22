import { App } from '@/App';
import { PopupsProvider } from '@/providers/PopupsProvider';
import '@/styles/animations.css';
import '@/styles/main.css';
import { isDev } from '@/utils/general';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { importCytoscapeExtensions } from './config/extensions';

importCytoscapeExtensions();

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('Root element with id "root" not found');
}

const appComponent = isDev() ? (
    <StrictMode>
        <PopupsProvider>
            <App />
        </PopupsProvider>
    </StrictMode>
) : (
    <PopupsProvider>
        <App />
    </PopupsProvider>
);

createRoot(rootElement).render(appComponent);
