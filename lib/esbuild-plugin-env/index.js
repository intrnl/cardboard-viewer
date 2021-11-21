import * as path from 'path';
import * as fs from 'fs/promises';
import * as esbuild from 'esbuild';
import escalade from 'escalade';

import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';


/**
 * @returns {esbuild.Plugin}
 */
export default function envPlugin (options = {}) {
	const { mode = process.env.NODE_ENV ?? 'development' } = options;

	const envFiles = [
		`.env.${mode}.local`,
		`.env.${mode}`,
		`.env.local`,
		`.env`,
	];

	return {
		name: 'env',
		async setup (build) {
			if (build.__resolve) {
				return;
			}

			const define = build.initialOptions.define = { ...build.initialOptions.define };

			// Grab from process env
			for (const key in process.env) {
				const value = process.env[key];
				define[`import.meta.env.${key}`] ??= JSON.stringify(value);
			}

			// Grab from dotfiles
			for (const file of envFiles) {
				const filename = await escalade('.', (_, names) => {
					return names.includes(file) && file;
				});

				if (!filename) {
					continue;
				}

				const source = await fs.readFile(filename, 'utf-8');
				const parsed = dotenv.parse(source);

				dotenvExpand({ parsed, ignoreProcessEnv: true });

				for (const key in parsed) {
					const value = parsed[key];
					define[`import.meta.env.${key}`] ??= JSON.stringify(value);
				}
			}
		},
	};
}
