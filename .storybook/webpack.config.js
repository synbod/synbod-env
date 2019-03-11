const path = require('path');
const fs = require('fs');
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

function searchRecursive(dir, pattern) {
  // This is where we store pattern matches of all files inside the directory
  var results = [];

  // Read contents of directory
  fs.readdirSync(dir).forEach(function(dirInner) {
    // Obtain absolute path
    dirInner = path.resolve(dir, dirInner);

    // Get stats to determine if path is a directory or a file
    var stat = fs.statSync(dirInner);

    // If path is a directory, scan it and combine results
    if (stat.isDirectory()) {
      results = results.concat(searchRecursive(dirInner, pattern));
    }

    // If path is a file and ends with pattern then push it onto results
    if (stat.isFile() && dirInner.endsWith(pattern)) {
      results.push(dir);
    }
  });

  return results;
}

module.exports = (baseConfig, env, defaultConfig) => {
  defaultConfig.devtool = 'eval-source-map';
  defaultConfig.module.rules[0].exclude = /node_modules\/(?!(@webcomponents\/shadycss|lit-html|@polymer|@vaadin|@lit)\/).*/;
  defaultConfig.module.rules.push({
    test: /\.tsx?$/,
    use: 'ts-loader',
    exclude: /node_modules/,
  });
  defaultConfig.module.rules.push({
    test: /\.css$/,
    use: ['css-loader'],
  });
  defaultConfig.module.rules.push({
    test: /\.scss$/,
    use: [
      { loader: 'css-loader', options: { importLoaders: 2 } },
      'sass-loader',
    ],
  });

  defaultConfig.resolve.extensions.push('.ts', '.tsx', '.wasm');
  defaultConfig.resolve.plugins = [
    new TsconfigPathsPlugin({
      configFile: path.resolve(__dirname, '../tsconfig.json'),
      mainFields: ['module'],
    }),
  ];

  // compile wasms
  const dirs = searchRecursive(
    path.resolve(__dirname, '../components'),
    'Cargo.toml'
  );
  dirs.forEach((dir) => {
    defaultConfig.plugins.push(new WasmPackPlugin({ crateDirectory: dir }));
  });

  defaultConfig.stats = 'verbose';

  return defaultConfig;
};
