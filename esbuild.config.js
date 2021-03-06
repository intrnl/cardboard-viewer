import * as esbuild from 'esbuild';

import env from '@intrnl/esbuild-plugin-env';
import vanillaExtract from '@intrnl/esbuild-plugin-vanilla-extract';


/** @type {esbuild.BuildOptions} */
export let config = {
	entryPoints: ['src/app.jsx'],
	outdir: 'dist/_assets',
	publicPath: '/_assets/',

	sourcemap: true,
	jsx: 'transform',
	jsxFactory: 'h',
	jsxFragment: 'Fragment',

	loader: {
		'.svg': 'file',
	},

	plugins: [
		env(),
		vanillaExtract(),
	],
};
