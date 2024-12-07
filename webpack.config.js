import path from 'path';
import terser from 'terser-webpack-plugin';
import TypescriptDeclarationPlugin from 'typescript-declaration-webpack-plugin';
import { fileURLToPath } from 'url';
import webpack from 'webpack';
import 'webpack-dev-server';

import packageJson from './package.json' assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WEBPACK_DEV_SERVER_PORT = 1000;

const testPath = 'http://localhost:' + WEBPACK_DEV_SERVER_PORT;
const prodPath = 'https://ddeeplb.github.io/BC-Responsive';

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');

/**
 * @param {boolean} env
 * @returns {Promise<import('webpack').Configuration>}
 */
export default async function (env) {
  const mode = env.prod ? 'production' : 'development';
  const modVersion = packageJson.version;

  return {
    entry: {
      app: path.join(SRC_DIR, 'DeepLib.ts'),
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
    mode: mode,
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
      alias: {
        'lib_public': path.resolve(__dirname, 'node_modules/bc-deeplib/public/'),
        'lib_types': path.resolve(__dirname, 'node_modules/bc-deeplib/.types/'),
        'public': path.resolve(__dirname, 'public/'),
        '_': SRC_DIR
      }
    },
    optimization: {
      minimize: true,
      minimizer: [
        new terser(),
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        PUBLIC_URL: JSON.stringify(mode === 'development' ? testPath : prodPath),
        MOD_VERSION: JSON.stringify(modVersion),
      }),
      new webpack.BannerPlugin({
        banner: '/* eslint-disable */',
        raw: true,
      }),
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


