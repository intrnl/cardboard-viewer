import { stableStringify } from '@intrnl/stable-stringify';


const defaultKey = () => {};
const defaultId = (x) => x.id;

export function createBatchedFetch (options) {
	const {
		fetch,
		limit = 100,
		timeout = 0,
		key: getKey = defaultKey,
		id: getId = defaultId,
	} = options;

	let curr;

	return (value) => {
		const deferred = createDeferred();

		const id = stableStringify(value);
		const key = getKey(value);

		let map = curr;

		if (!map || map.values.length >= limit || map.key !== key) {
			map = curr = createMap(key);
		}

		map.values.push(value);
		map.items.set(id, deferred);

		clearTimeout(map.timeout);

		map.timeout = setTimeout(() => {
			if (curr === map) {
				curr = null;
			}

			perform(map, fetch, getId);
		}, timeout);

		return deferred.promise;
	};
}

async function perform (map, fetch, getId) {
	const { items, values } = map;
	let errored = false;

	try {
		const dataset = await fetch(values);

		for (const data of dataset) {
			const id = stableStringify(getId(data));
			const deferred = items.get(id);

			deferred?.resolve(data);
		}
	}
	catch (error) {
		errored = true;

		for (const deferred of items.values()) {
			deferred.reject(error);
		}
	}
	finally {
		if (errored) {
			return;
		}

		for (const deferred of items.values()) {
			deferred.reject(new Error('Requested batch does not contain specified resource'));
		}
	}
}

function createMap (key) {
	return {
		values: [],
		items: new Map(),
		key: key,
		timeout: null,
	};
}

function createDeferred () {
	let deferred = {};

	deferred.promise = new Promise((resolve, reject) => (
		Object.assign(deferred, { resolve, reject })
	));

	return deferred;
}

