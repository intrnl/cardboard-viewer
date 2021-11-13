import * as path from 'path';

import { defineConfig } from 'vite';
import prefresh from '@prefresh/vite'


export default defineConfig({
	envPrefix: ['VITE_', 'CF_PAGES_'],
	build: {
		target: 'esnext',
		sourcemap: true,
		rollupOptions: {
			output: {
				generatedCode: 'es2015',
			},
		},
	},
	esbuild: {
		jsxFactory: 'h',
		jsxFragment: 'Fragment',
	},
	resolve: {
		alias: {
			'~': path.resolve(),
			'react': 'preact/compat',
			'react-dom': 'preact/compat',
			'history': 'history/history.production.min.js',
		},
	},
	css: {
		modules: {
			generateScopedName: '[local]_[hash:6]',
			localsConvention: 'camelCaseOnly',
		},
	},
	plugins: [
		prefresh(),
	],
});
