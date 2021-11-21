import * as esbuild from 'esbuild';
import buildAnalysis from '../lib/esbuild-plugin-build-analysis/index.js';

import { config } from '../esbuild.config.js';


await esbuild.build({
	...config,
	logLevel: 'info',
	minify: true,
	plugins: [
		...config.plugins || [],
		buildAnalysis(),
	],
});
