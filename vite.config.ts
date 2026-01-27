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
            ...makeDouble('@Modals', '/src/components/Modals'),
            '@Logger': '/src/utils/Logger',
        },
    },
    dev: {
        sourcemap: true,
    },
});

function makeDouble(alias: string, aliasPath: string) {
    return {
        [alias]: aliasPath,
        [`${alias}/*`]: `${aliasPath}/*`,
    };
}
