// import $ from 'jquery';

// import { checkDevelopment } from './utils.js';
// import { App } from './app.js';

import React from 'react';
import { createRoot } from 'react-dom/client';

// Clear the existing HTML content
document.body.innerHTML = '<div id="app"></div>';

const rootElement = document.getElementById('app');

if (!rootElement) {
    throw new Error('Root element with id "app" not found');
}

// Render your React component instead
const root = createRoot(rootElement);
root.render(<h1>Hello, world </h1>);

// // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// declare global {
//     interface Window {
//         app: App;
//     }
// }
// // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// const app = new App;
// window.app = app; // Expose app to the global scope for debugging

// $(function () {
//     checkDevelopment();

//     app.init();
//     console.log(app);

//     // Remove loading screen after 700ms
//     $('#loader-wrapper').fadeOut(700);
// });

// // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
