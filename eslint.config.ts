import stylistic from '@stylistic/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
    globalIgnores(['dist']),
    {
        files: ['**/*.{ts,tsx}'],
        plugins: {
            '@stylistic': stylistic
        },
        extends: [
            tseslint.configs.strictTypeChecked,
            // tseslint.configs.stylisticTypeChecked,
            reactHooks.configs['recommended-latest'],
            reactRefresh.configs.vite,
        ],
        languageOptions: {
            ecmaVersion: 2022,
            globals: globals.browser,
            sourceType: 'module',
            parserOptions: {
                project: ['./tsconfig.node.json', './tsconfig.app.json'],
                tsconfigRootDir: import.meta.dirname,

            },
        },
        rules: {
            // Typescript
            '@typescript-eslint/consistent-type-definitions': ['error', 'type'],

            // Stylistic Rules
            // https://eslint.style/rules/array-bracket-newline
            '@stylistic/array-bracket-newline': ['error', 'consistent'],
            // https://eslint.style/rules/array-bracket-spacing
            '@stylistic/array-bracket-spacing': ['error', 'never'],
            // https://eslint.style/rules/array-element-newline
            '@stylistic/array-element-newline': ['error', 'consistent'],
            // https://eslint.style/rules/arrow-parens
            '@stylistic/arrow-parens': [2, 'as-needed', { requireForBlockBody: true }],
            // https://eslint.style/rules/arrow-spacing
            '@stylistic/arrow-spacing': 'error',
            // https://eslint.style/rules/block-spacing
            '@stylistic/block-spacing': 'error',
            // https://eslint.style/rules/brace-style
            '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
            // https://eslint.style/rules/comma-dangle
            '@stylistic/comma-dangle': ['error', {
                arrays: 'only-multiline',
                objects: 'only-multiline',
                imports: 'never',
                exports: 'never',
                functions: 'only-multiline',
                importAttributes: 'only-multiline',
                dynamicImports: 'ignore',
                enums: 'only-multiline',
                generics: 'only-multiline',
                tuples: 'only-multiline',
            }],
            // https://eslint.style/rules/comma-spacing
            '@stylistic/comma-spacing': ['error', { before: false, after: true }],
            // https://eslint.style/rules/comma-style
            '@stylistic/comma-style': ['error', 'last'],
            // https://eslint.style/rules/curly-newline
            '@stylistic/curly-newline': ['error', { consistent: true }],
            // https://eslint.style/rules/dot-location
            '@stylistic/dot-location': ['error', 'property'],
            // https://eslint.style/rules/eol-last
            '@stylistic/eol-last': ['error', 'always'],
            // https://eslint.style/rules/function-call-spacing
            '@stylistic/function-call-spacing': ['error', 'never'],
            // https://eslint.style/rules/function-call-argument-newline
            '@stylistic/function-call-argument-newline': ['error', 'consistent'],
            // https://eslint.style/rules/function-paren-newline
            '@stylistic/function-paren-newline': ['error', 'consistent'],
            // https://eslint.style/rules/indent
            '@stylistic/indent': ['error', 4],
            // https://eslint.style/rules/indent-binary-ops
            '@stylistic/indent-binary-ops': ['error', 4],
            // https://eslint.style/rules/keyword-spacing
            '@stylistic/keyword-spacing': ['error'],
            // https://eslint.style/rules/member-delimiter-style
            '@stylistic/member-delimiter-style': 'error',
            // https://eslint.style/rules/multiline-ternary
            '@stylistic/multiline-ternary': ['error', 'always-multiline'],
            // https://eslint.style/rules/new-parens
            '@stylistic/new-parens': ['error', 'never'],
            // https://eslint.style/rules/no-extra-parens
            // '@stylistic/no-extra-parens': ['error', 'all', { ignoreJSX: 'multi-line', nestedBinaryExpressions: false }],
            // https://eslint.style/rules/no-extra-semi
            '@stylistic/no-extra-semi': 'error',
            // https://eslint.style/rules/no-floating-decimal
            '@stylistic/no-floating-decimal': 'error',
            // https://eslint.style/rules/no-mixed-operators
            '@stylistic/no-mixed-operators': 'error',
            // https://eslint.style/rules/no-mixed-spaces-and-tabs
            '@stylistic/no-mixed-spaces-and-tabs': 'error',
            // https://eslint.style/rules/no-multi-spaces
            '@stylistic/no-multi-spaces': 'error',
            // https://eslint.style/rules/no-trailing-spaces
            '@stylistic/no-trailing-spaces': ['error', { skipBlankLines: true }],
            // https://eslint.style/rules/no-whitespace-before-property
            '@stylistic/no-whitespace-before-property': 'error',
            // https://eslint.style/rules/object-curly-newline
            '@stylistic/object-curly-newline': ['error', { consistent: true }],
            // https://eslint.style/rules/object-curly-spacing
            '@stylistic/object-curly-spacing': ['error', 'always'],
            // https://eslint.style/rules/operator-linebreak
            '@stylistic/operator-linebreak': ['error', 'after', { overrides: { '?': 'before', ':': 'before' } }],
            // https://eslint.style/rules/quote-props
            '@stylistic/quote-props': ['error', 'consistent-as-needed'],
            // https://eslint.style/rules/quotes
            '@stylistic/quotes': ['error', 'single'],
            // https://eslint.style/rules/rest-spread-spacing
            '@stylistic/rest-spread-spacing': ['error', 'never'],
            // https://eslint.style/rules/semi
            '@stylistic/semi': 'error',
            // https://eslint.style/rules/semi-spacing
            '@stylistic/semi-spacing': 'error',
            // https://eslint.style/rules/semi-style
            '@stylistic/semi-style': ['error', 'last'],
            // https://eslint.style/rules/space-before-blocks
            '@stylistic/space-before-blocks': 'error',
            // https://eslint.style/rules/space-before-function-paren
            '@stylistic/space-before-function-paren': ['error', { anonymous: 'always', named: 'never', asyncArrow: 'always' }],
            // https://eslint.style/rules/space-in-parens
            '@stylistic/space-in-parens': ['error', 'never'],
            // https://eslint.style/rules/space-unary-ops
            '@stylistic/space-unary-ops': 'error',
            // https://eslint.style/rules/switch-colon-spacing
            '@stylistic/switch-colon-spacing': 'error',
            // https://eslint.style/rules/template-curly-spacing
            '@stylistic/template-curly-spacing': ['error', 'never'],
            // https://eslint.style/rules/type-annotation-spacing
            '@stylistic/type-annotation-spacing': ['error', {
                before: false,
                after: true,
                overrides: {
                    arrow: { before: true, after: true }
                }
            }],
            // https://eslint.style/rules/type-generic-spacing
            '@stylistic/type-generic-spacing': ['error'],
            // https://eslint.style/rules/type-named-tuple-spacing
            '@stylistic/type-named-tuple-spacing': ['error'],

            // JSX Related
            // https://eslint.style/rules/jsx-closing-bracket-location
            // '@stylistic/jsx-closing-bracket-location': 'error',
            // https://eslint.style/rules/jsx-closing-tag-location
            // '@stylistic/jsx-closing-tag-location': 'error',
            // https://eslint.style/rules/jsx-curly-brace-presence
            '@stylistic/jsx-curly-brace-presence': ['error', 'never'],
            // https://eslint.style/rules/jsx-curly-newline
            '@stylistic/jsx-curly-newline': 'error',
            // https://eslint.style/rules/jsx-curly-spacing
            '@stylistic/jsx-curly-spacing': ['error', { when: 'always' }],
            // https://eslint.style/rules/jsx-equals-spacing
            '@stylistic/jsx-equals-spacing': 'error',
            // https://eslint.style/rules/jsx-first-prop-new-line
            '@stylistic/jsx-first-prop-new-line': ['error', 'multiline'],
            // https://eslint.style/rules/jsx-function-call-newline
            '@stylistic/jsx-function-call-newline': ['error', 'multiline'],
            // https://eslint.style/rules/jsx-indent-props
            '@stylistic/jsx-indent-props': ['error', 4],
            // https://eslint.style/rules/jsx-max-props-per-line
            '@stylistic/jsx-max-props-per-line': ['error', { maximum: 1, when: 'multiline' }],
            // https://eslint.style/rules/jsx-newline
            // '@stylistic/jsx-newline': ['error', { prevent: true, allowMultilines: true }],
            // https://eslint.style/rules/jsx-one-expression-per-line
            '@stylistic/jsx-one-expression-per-line': ['error', { allow: 'single-line' }],
            // https://eslint.style/rules/jsx-pascal-case
            '@stylistic/jsx-pascal-case': ['error', { allowNamespace: true }],
            // https://eslint.style/rules/jsx-props-no-multi-spaces
            '@stylistic/jsx-props-no-multi-spaces': 'error',
            // https://eslint.style/rules/jsx-quotes
            '@stylistic/jsx-quotes': ['error', 'prefer-single'],
            // https://eslint.style/rules/jsx-self-closing-comp
            '@stylistic/jsx-self-closing-comp': 'error',
            // https://eslint.style/rules/jsx-sort-props
            '@stylistic/jsx-sort-props': ['error', {
                ignoreCase: true,
                shorthandFirst: true,
                reservedFirst: true,
                multiline: 'last',
            }],
            // https://eslint.style/rules/jsx-tag-spacing
            '@stylistic/jsx-tag-spacing': ['error', {
                afterOpening: 'never',
                beforeSelfClosing: 'always',
                beforeClosing: 'never',
            }],
            '@stylistic/jsx-wrap-multilines': ['error', {
                declaration: 'parens',
                assignment: 'parens',
                return: 'parens',
                arrow: 'parens',
                condition: 'ignore',
                logical: 'ignore',
                prop: 'ignore',
                propertyValue: 'ignore'
            }],
        }
    },
]);
