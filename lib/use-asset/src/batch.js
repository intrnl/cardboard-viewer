import { stringify } from './utils';

const defaultKey = () => {};
const defaultId = (x) => x.id;

export function createBatchedFetch (options) {
	const {
		fetch,
		limit = 100,
		timeout = 250,
		key: getKey = defaultKey,
		id: getId = defaultId,
	} = options;

	let map;

	return (value) => {
		const deferred = createDeferred();

		const id = stringify(value);
		const key = getKey(value);

		if (!map || map.stale || map.items.length >= limit || map.key !== key) {
			map = createMap(key);
		}

		map.values.push(value);
		map.items.set(id, deferred);

		clearTimeout(map.timeout);
		map.timeout = setTimeout(() => perform(map, fetch, getId), timeout);

		return deferred.promise;
	}
}

async function perform (map, fetch, getId) {
	map.stale = true;

	const { items, values } = map;
	let errored = false;

	try {
		const dataset = await fetch(values);

		for (const data of dataset) {
			const id = stringify(getId(data));
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
		stale: false,
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