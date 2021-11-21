import * as fs from 'fs/promises';
import * as path from 'path';
import * as esbuild from 'esbuild';
import postcss from 'postcss';
import postcssModules from 'postcss-modules';

import { FSCache, getProjectRoot } from '../filesystem-cache/index.js';
import { dataToEsm } from './data.js';


const RE_CSS = /.\.css$/i;
const RE_OUTPUT = /.\.css\?__postcss$/i;
const RE_MODULE = /.\.module\.[a-z]+$/i;

const DUMMY_PLUGIN = {
	postcssPlugin: 'noop',
	Once () {},
};

/**
 * @param {object} options
 * @returns {esbuild.Plugin}
 */
export default function postcssPlugin (options = {}) {
	const { modules = true, cache = true, plugins = [] } = options;

	if (!plugins.length) {
		plugins.push(DUMMY_PLUGIN);
	}

	const moduleCache = modules && new Map();
	const modulePlugin = modules && postcssModules({
		scopeBehaviour: 'local',
		localsConvention: 'camelCaseOnly',
		generateScopedName: '[local]_[hash:6]',
		...(modules === true ? {} : modules),
		getJSON (filename, json) {
			moduleCache.set(filename, json);
		},
	});

	return {
		name: 'postcss',
		async setup (build) {
			if (build.__resolve) {
				return;
			}

			const fsCache = cache && new FSCache({
				...await getProjectRoot('postcss'),
				version: 0 + cache,
			});

			const cssCache = new Map();

			build.onLoad({ filter: RE_CSS }, async (args) => {
				const { path: filename, namespace } = args;

				if (namespace !== 'file' && namespace !== '') {
					return null;
				}

				if (cache) {
					const cached = await fsCache.read(filename);

					if (cached) {
						const { dependencies, data } = cached;
						const { js, css } = data;

						cssCache.set(filename, css);

						return {
							loader: 'js',
							contents: js,
							watchFiles: dependencies,
						};
					}
				}

				const isModule = RE_MODULE.test(filename);
				const source = await fs.readFile(filename, 'utf-8');

				const processor = postcss(isModule ? [modulePlugin, ...plugins] : plugins);
				const result = await processor.process(source, { from: filename });

				// Retrieve dependencies
				const dependencies = [];

				for (const message of result.messages) {
					if (message.type === 'dependency') {
						dependencies.push(message.file);
					}
				}

				// Log warnings
				const warnings = [];

				for (const message of result.warnings()) {
					warnings.push({
						text: message.text,
						location: {
							line: message.line,
							column: message.column,
						}
					})
				}

				// Retrieve CSS module object
				let modules = moduleCache.get(filename);

				if (!modules && isModule) {
					console.warn(`CSS module returned empty: ${filename}`);
				}

				modules ||= {};

				// Resulting output
				const css = result.css;
				const js = `
					import ${JSON.stringify(path.basename(filename) + '?__postcss')};
					${dataToEsm(modules)}
				`;

				cssCache.set(filename, css);

				if (cache) {
					await fsCache.write(filename, { dependencies, data: { css, js } });
				}

				return {
					loader: 'js',
					contents: js,
					watchFiles: dependencies,
					warnings: warnings,
				};
			});

			build.onLoad({ filter: /./, namespace: 'postcss' }, (args) => {
				const { path: filename } = args;
				const css = cssCache.get(filename) || '';
				const warnings = [];

				return {
					loader: 'css',
					contents: css,
					warnings,
				};
			});

			build.onResolve({ filter: RE_OUTPUT }, (args) => {
				const { path: file, importer } = args;

				const dirname = path.dirname(importer);
				const filename = path.join(dirname, file.slice(0, -10));

				if (!cssCache.has(filename)) {
					return null;
				}

				return {
					path: filename,
					namespace: 'postcss',
				};
			});
		},
	};
}