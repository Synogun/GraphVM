import { App } from '@/App';
import { ModalsProvider } from '@/providers/ModalsProvider.js';
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
        <ModalsProvider>
            <App />
        </ModalsProvider>
    </StrictMode>
) : (
    <ModalsProvider>
        <App />
    </ModalsProvider>
);

createRoot(rootElement).render(appComponent);
