module.exports = {
    presets: ['@babel/preset-env', '@babel/typescript'],
    plugins: [
        'syntax-dynamic-import',
        '@babel/proposal-class-properties',
        '@babel/proposal-object-rest-spread',
    ],
};
