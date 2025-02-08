// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'

export default tseslint.config([
    {
        files: [
            'src/**/*.ts',
            'src/**/*.js',
        ],
    },
    {
        ignores: [
            'node_modules/**/*',
            'build/**/*',
            'release/**/*',
            'eslint.config.mjs',
        ],
    },
    {
        plugins: {
            '@typescript-eslint': tseslint.plugin,
            'stylistic': stylistic
        },
    },
        {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        rules: {
            'stylistic/array-bracket-newline': ["error", "consistent"],
            'stylistic/array-bracket-spacing': ["error", "never"],
            'stylistic/array-element-newline': ["error", "consistent"],
            'stylistic/arrow-parens': [2, "as-needed", { "requireForBlockBody": true }],
            'stylistic/arrow-spacing': "error",
            'stylistic/block-spacing': 'error',
            'stylistic/brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
            'stylistic/comma-dangle': ["error", "always-multiline"],
            'stylistic/comma-spacing': ["error", { "before": false, "after": true }],
            'stylistic/comma-style': ["error", "last"],
            'stylistic/curly-newline': ["error", { "consistent": true }],
            'stylistic/dot-location': ["error", "property"],
            'stylistic/eol-last': ["error", "always"],
            'stylistic/function-call-spacing': ["error", "never"],
            'stylistic/function-call-argument-newline': ["error", "consistent"],
            'stylistic/function-paren-newline': ["error", "consistent"],
            'stylistic/indent': ['error', 4],
            'stylistic/indent-binary-ops': ['error', 4],
            'stylistic/keyword-spacing': ['error'],
            'stylistic/member-delimiter-style': "error",
            'stylistic/multiline-ternary': ["error", "always-multiline"],
            'stylistic/new-parens': ["error", "never"],
            'stylistic/no-extra-parens': ["error", "all", { "nestedBinaryExpressions": false }],
            'stylistic/no-extra-semi': 'error',
            'stylistic/no-floating-decimal': 'error',
            'stylistic/no-mixed-operators': "error",
            'stylistic/no-mixed-spaces-and-tabs': "error",
            'stylistic/no-multi-spaces': "error",
            'stylistic/no-trailing-spaces': ['error', { 'skipBlankLines': true }],
            'stylistic/no-whitespace-before-property': "error",
            'stylistic/object-curly-newline': ["error", { "consistent": true }],
            'stylistic/object-curly-spacing': ['error', 'always'],
            'stylistic/operator-linebreak': ["error", "after", { "overrides": { "?": "before", ":": "before" } }],
            'stylistic/quote-props': ["error", "consistent-as-needed"],
            'stylistic/quotes': ['error', 'single'],
            'stylistic/rest-spread-spacing': ["error", "never"],
            'stylistic/semi': 'error',
            'stylistic/semi-spacing': "error",
            'stylistic/semi-style': ["error", "last"],
            'stylistic/space-before-blocks': "error",
            'stylistic/space-before-function-paren': ['error', { 'anonymous': 'always', 'named': 'never', 'asyncArrow': 'always' }],
            'stylistic/space-in-parens': ["error", "never"],
            'stylistic/space-unary-ops': 'error',
            'stylistic/switch-colon-spacing': 'error',
            'stylistic/template-curly-spacing': ['error', 'never'],
            'stylistic/type-annotation-spacing': ['error', { 'before': false, 'after': true }],
            'stylistic/type-generic-spacing': ["error"],
            'stylistic/type-named-tuple-spacing': ["error"],
        },
    },
    eslint.configs.recommended,
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
]);
