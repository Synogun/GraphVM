import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
    base: '/GraphVM/',
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@': '/src',

            // Very specific but useful aliases
            '@Logger': '/src/utils/Logger',
        },
    },
    dev: {
        sourcemap: true,
    },
});
