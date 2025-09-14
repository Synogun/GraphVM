import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { isDev } from './utils.js';

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('Root element with id "root" not found');
}

const appComponent = isDev()
    ? (
        <StrictMode>
            <App />
        </StrictMode>
    )
    : <App />;

createRoot(rootElement)
    .render(appComponent);
