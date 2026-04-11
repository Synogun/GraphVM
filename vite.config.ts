import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig({
    base: '/GraphVM/',
    plugins: [
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': '/src',

            // Very specific but useful aliases
            ...makeDouble('@Modals', '/src/components/Modals'),
            '@Inputs': '/src/components/common/inputs',
            '@Contexts': '/src/contexts',
            '@Logger': '/src/config/logger',
            '@Config': '/src/config',
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
    test: {
        include: ['tests/unit/**/*.test.ts', 'tests/integration/**/*.test.ts?(x)'],
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./tests/setup/vitest.setup.ts'],
    },
});

function makeDouble(alias: string, aliasPath: string) {
    return {
        [alias]: aliasPath,
        [`${alias}/*`]: `${aliasPath}/*`,
    };
}
