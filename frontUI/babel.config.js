module.exports = {
	presets: ['@vue/cli-plugin-babel/preset', '@babel/typescript'],
	plugins: [
		'syntax-dynamic-import',
		'@babel/proposal-class-properties',
		'@babel/proposal-object-rest-spread',
	],
};
