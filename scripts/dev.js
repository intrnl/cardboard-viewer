import * as esbuild from 'esbuild';

import { config } from '../esbuild.config.js';


const result = await esbuild.serve({
	servedir: 'dist/',
}, {
	...config,
	sourcemap: true,
	define: {
		...config.define,
		'import.meta.env.CF_PAGES_COMMIT_SHA': 'undefined',
		'import.meta.env.CF_PAGES_BRANCH': 'undefined',
	},
	plugins: [
		...config.plugins || [],
	],
});

console.log(`Running on ${result.host}:${result.port}`);
