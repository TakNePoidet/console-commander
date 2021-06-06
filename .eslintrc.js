module.exports = {
	extends: ['@taknepoidet-config/eslint-config'],
	rules: {
		'no-useless-escape': 0,
		'consistent-return': 0
	},
	overrides: [
		{
			files: './src/**',
			extends: ['plugin:jsdoc/recommended'],
			plugins: ['jsdoc']
		},
		{
			files: ['*.spec.ts'],
			plugins: ['jest'],
			rules: {
				'jest/no-disabled-tests': 'warn',
				'jest/no-focused-tests': 'error',
				'jest/no-identical-title': 'error',
				'jest/prefer-to-have-length': 'warn',
				'jest/valid-expect': 'error'
			},
			env: {
				'jest/globals': true
			}
		}
	]
};
