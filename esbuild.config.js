import * as esbuild from 'esbuild';

import env from '@intrnl/esbuild-plugin-env';
import postcss from '@intrnl/esbuild-plugin-postcss';
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
		postcss({
			modules: {
				generateScopedName: process.env.NODE_ENV === 'development'
					? '[local]_[hash:6]'
					: '_[hash:6]',
			},
		}),
	],
};
