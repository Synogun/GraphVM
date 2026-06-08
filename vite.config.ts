import tailwindcss from '@tailwindcss/vite';
import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig({
    base: '/GraphVM/',
    plugins: [
        react(),
        babel({ presets: [reactCompilerPreset()] }),
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
        chunkSizeWarningLimit: 600,
        rolldownOptions: {
            output: {
                codeSplitting: {
                    groups: [
                        { name: 'cytoscape', test: /node_modules\/cytoscape/ },
                        { name: 'react', test: /node_modules\/react/ },
                    ],
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
