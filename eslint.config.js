import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';

const configs = [
	eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	{
		languageOptions: {
			globals: globals.browser,
			parserOptions: {
				project: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			'array-bracket-spacing': ['error', 'never'],
			'linebreak-style': ['error', 'unix'],
			'camelcase': ['error'],
			'comma-dangle': ['error', {'arrays': 'always-multiline', 'objects': 'always-multiline'}],
			'no-trailing-spaces': ['error'],
			'object-curly-spacing': ['error', 'never'],
			'prefer-const': ['error', {'destructuring': 'all'}],
			'quotes': ['error', 'single'],
			'semi': ['error', 'always'],
			'space-infix-ops': ['error'],
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-floating-promises': ['error', {'ignoreIIFE': true}],
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/no-unused-vars': ['error', {'args': 'none'}],
			'@typescript-eslint/unbound-method': 'off',
		},
	},
];
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
export default tseslint.config(...configs.map((c) => ({...c, ignores: ['static/*']})));
