import $ from 'jquery';

import { checkDevelopment } from './utils.js';
import { App } from './app.js';

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

declare global {
    interface Window {
        app: App;
    }
}
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const app = new App;
window.app = app; // Expose app to the global scope for debugging

$(function () {
    checkDevelopment();

    app.init();
    console.log(app);

    // Remove loading screen after 700ms
    $('#loader-wrapper').fadeOut(700);
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
