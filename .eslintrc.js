module.exports = {
	env: {
		es2021: true,
		node: true,
	},
	extends: [
		'standard-with-typescript',
		'prettier',
		'plugin:security/recommended',
	],
	overrides: [
		{
			env: {
				node: true,
			},
			files: ['.eslintrc.{js,cjs}'],
			parserOptions: {
				sourceType: 'script',
			},
		},
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	rules: {
		'@typescript-eslint/no-misused-promises': 'off',
	},
	plugins: ['security', '@typescript-eslint'],
};
