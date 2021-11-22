import * as esbuild from 'esbuild';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import env from '@intrnl/esbuild-plugin-env';
import alias from '@intrnl/esbuild-plugin-alias';
import postcss from '@intrnl/esbuild-plugin-postcss';


/** @type {esbuild.BuildOptions} */
export let config = {
	entryPoints: ['src/app.jsx'],
	outdir: 'dist/_assets',
	publicPath: '/_assets/',

	jsx: 'transform',
	jsxFactory: 'h',
	jsxFragment: 'Fragment',

	loader: {
		'.svg': 'file',
	},

	plugins: [
		env(),
		postcss(),
		alias({
			entries: {
				'~': dirname(fileURLToPath(import.meta.url)),
				'react': 'preact/compat',
				'react-dom': 'preact/compat',
			},
		}),
	],
};
