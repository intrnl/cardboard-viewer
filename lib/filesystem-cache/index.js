import * as fs from 'fs/promises';
import * as path from 'path';
import escalade from 'escalade';

import { hash } from './xxhash.js';


const cacheVersion = 0n;

export class FSCache {
	#key;
	#version;
	#baseDir;
	#cacheDir;

	constructor ({ key = '', version = '', base, cache } = {}) {
		this.#key = key;
		this.#version = version;
		this.#baseDir = base ?? path.resolve();
		this.#cacheDir = cache ?? path.join(base, '.cache');
	}

	async read (file) {
		const hash = this.#hash(file);

		try {
			const source = await fs.readFile(this.#getLocation(hash), 'utf-8');
			const data = await JSON.parse(source);

			const dependencies = data.dependencies;
			const array = [];

			for (const dep in dependencies) {
				const mtime = dependencies[dep];
				const abs = path.join(this.#baseDir, dep);

				const stat = await fs.stat(abs);

				if (stat.mtime.toISOString() != mtime) {
					return;
				}

				array.push(abs);
			}

			return { dependencies: array, data: data.data };
		}
		catch (error) {
			if (error.code === 'ENOENT') {
				return;
			}

			throw error;
		}
	}

	async write (file, options = {}) {
		let { dependencies = [], ignoreSelf = false, data } = options;

		if (!ignoreSelf) {
			dependencies = [file, ...dependencies];
		}

		const map = {};

		for (const dep of dependencies) {
			const rel = path.relative(this.#baseDir, dep);
			const stat = await fs.stat(dep);

			map[rel] = stat.mtime.toISOString();
		}

		const hash = this.#hash(file);
		const cache = { data, dependencies: map };

		const location = this.#getLocation(hash);
		await fs.writeFile(location, JSON.stringify(cache, null, '\t'));
	}

	#getLocation (hash) {
		return path.join(this.#cacheDir, `${hash.toString(36)}.json`);
	}

	#hash (file) {
		const rel = path.relative(this.#baseDir, file);
		return hash(this.#key + this.#version + ':' + rel, cacheVersion);
	}
}

export async function getProjectRoot (key, cwd = path.resolve()) {
	const folder = 'node_modules';

	const modules = await escalade(cwd, (_, names) => {
		return names.includes(folder) && folder;
	});

	const base = modules ? path.join(modules, '..') : cwd;
	const cache = path.join(modules || cwd, '.cache', key);

	await fs.mkdir(cache, { recursive: true });

	return { key, base, cache };
}
