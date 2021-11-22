import * as esbuild from 'esbuild';
import * as path from 'path';


/**
 * @param {object} options
 * @returns {esbuild.Plugin}
 */
export default function aliasPlugin (options = {}) {
	const { entries } = options;
	const matcher = createMatcher(entries);

	return {
		name: 'alias',
		setup (build) {
			const resolve = createResolveContainer(build.initialOptions);

			build.onResolve({ filter: matcher }, async (args) => {
				const nextId = args.path.replace(matcher, (_, id, end) => {
					return entries[id] + end;
				});

				const resolved = await resolve(nextId, args.importer);

				return { path: resolved };
			});
		},
	};
}

function createMatcher (object) {
	const find = Object.keys(object);

	return new RegExp(
		'^(' + find.map(escapeRE).join('|') + ')($|[\\//])'
	);
}

function escapeRE (string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


const excluded = new Set([
	'build-analysis',
	'alias',
	'@intrnl/esbuild-plugin-env',
]);

/**
 * @param {esbuild.PluginOptions} buildOptions
 */
function createResolveContainer (buildOptions) {
	const customOptions = {
		...buildOptions,
		inject: [],
		define: {},
		logLevel: 'silent',
		write: false,
		entryPoints: undefined,
		publicPath: undefined,
		splitting: false,
		plugins: buildOptions.plugins?.filter((plugin) => !excluded.has(plugin.name)) || [],
	};

	return async function resolve (source, importer) {
		let result;

		/** @type {esbuild.Plugin} */
		const resolvePlugin = {
			name: 'resolve',
			setup (build) {
				build.__resolve = true;

				build.onLoad({ filter: /.*/ }, (args) => {
					result = args.path;
					return { contents: '' };
				});
			},
		};

		await esbuild.build({
			...customOptions,
			stdin: {
				contents: `import ${JSON.stringify(source)};`,
				resolveDir: path.dirname(importer || source),
			},
			plugins: [
				resolvePlugin,
				...customOptions.plugins,
			],
		});

		return result;
	}
}
