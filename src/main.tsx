import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { isDev, setupLiveReload } from './utils.js';

setupLiveReload();

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
