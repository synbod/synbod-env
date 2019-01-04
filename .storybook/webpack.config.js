module.exports = (baseConfig, env, defaultConfig) => {
  defaultConfig.module.rules[0].exclude = /node_modules\/(?!(@webcomponents\/shadycss|lit-html|@polymer|@vaadin|@lit)\/).*/;
  defaultConfig.module.rules.push({
    test: /\.tsx?$/,
    use: 'ts-loader',
    exclude: /node_modules/
  });
  defaultConfig.resolve.extensions.push('.ts', '.tsx');
  return defaultConfig;
};
