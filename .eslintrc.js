module.exports = {
	root: true,
	parserOptions: {
		project: './tsconfig.json',
		tsconfigRootDir: __dirname,
	},
	extends: ['lisk-base/ts'],
	rules: {
		'@typescript-eslint/member-ordering': [
			'error',
			{
				default: [
					// Static fields and methods
					'static-field',
					'static-method',

					// Instance fields
					'instance-field',

					// Constructors
					'constructor',

					// Instance methods
					'instance-method',
				],
			},
		],
	},
};
