import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { ModalsProvider } from './providers/ModalsProvider.js';
import { isDev } from './utils.js';

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('Root element with id "root" not found');
}

const appComponent = isDev()
    ? (
        <StrictMode>
            <ModalsProvider>
                <App />
            </ModalsProvider>
        </StrictMode>
    )
    : <App />;

createRoot(rootElement)
    .render(appComponent);
