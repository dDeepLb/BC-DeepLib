import path from 'path';
import terser from 'terser-webpack-plugin';
import TypescriptDeclarationPlugin from 'typescript-declaration-webpack-plugin';
import { fileURLToPath } from 'url';
import 'webpack-dev-server';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WEBPACK_DEV_SERVER_PORT = 9999;

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');

/**
 * @param {boolean} env
 * @returns {Promise<import('webpack').Configuration>}
 */
export default async function () {

  return {
    entry: {
      app: path.join(SRC_DIR, 'deep_lib.ts'),
    },
    output: {
      filename: 'deeplib.js',
      path: DIST_DIR,
      library: {
        type: 'modern-module',
      },
      clean: true,
    },
    devServer: {
      hot: true,
      open: false,
      client: false,
      allowedHosts: 'all',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
        'Access-Control-Expose-Headers': 'Content-Length',
        'Access-Control-Allow-Headers': 'Accept, Authorization, Content-Type, X-Requested-With, Range',
      },
      port: WEBPACK_DEV_SERVER_PORT,
    },
    devtool: 'source-map',
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: {
            loader: 'ts-loader',
          }
        },
        {
          test: /\.css$/,
          use: 'css-loader',
        },
        {
          test: /\.s[ac]ss$/i,
          use: 'sass-loader',
        },
        {
          test: /\.html$/,
          use: 'html-loader',
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js', '.css', '.html'],
    },
    optimization: {
      minimize: false,
      minimizer: [
        new terser(),
      ],
    },
    plugins: [
      new TypescriptDeclarationPlugin({
        out: 'deeplib.d.ts',
      }),
    ],
    target: ['web', 'es6'],
    experiments: {
      outputModule: true,
    },
  };
}


