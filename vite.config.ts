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
            '@Inputs': '/src/components/common/inputs',
            '@Contexts': '/src/contexts',
            '@Logger': '/src/config/logger',
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    cytoscape: ['cytoscape'],
                    react: ['react', 'react-dom'],
                },
            },
        },
    },
    css: {
        devSourcemap: true,
    },
});

function makeDouble(alias: string, aliasPath: string) {
    return {
        [alias]: aliasPath,
        [`${alias}/*`]: `${aliasPath}/*`,
    };
}
