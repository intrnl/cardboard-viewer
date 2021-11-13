import { useLayoutEffect, useMemo, useRef, useState } from 'preact/hooks';

import { createResource } from './resource.js';
import { stringify } from './utils.js';


export function createAsset (fetcher, lifespan) {
	return new Asset(fetcher, lifespan);
}


const RECORD_PENDING = 0;
const RECORD_FULFILLED = 1;
const RECORD_REJECTED = 2;

class Asset {
	#cache = new Map();

	#fetcher;
	#lifespan;

	constructor (fetcher, lifespan = -1) {
		this.#fetcher = fetcher;
		this.#lifespan = lifespan;
	}

	read (key, options) {
		const id = stringify(key);
		return this.#use(key, id, options);
	}

	get (key, options) {
		const id = stringify(key);

		return useMemo(() => (
			createResource(() => this.#use(key, id, options))
		), [id]);
	}


	set (key, value) {
		const id = stringify(key);

		const cache = this.#cache;
		const lifespan = this.#lifespan;

		const promise = (async () => {
			if (lifespan > 0) {
				setTimeout(() => cache.delete(id), lifespan);
			}

			return value;
		})();

		cache.set(id, createRecord(promise));
	}

	delete (key) {
		const cache = this.#cache;
		const id = stringify(key);

		cache.delete(id);
	}


	#use (key, id, options = {}) {
		const { readonly, disabled } = options;

		const cache = this.#cache;
		const fetcher = this.#fetcher;
		const lifespan = this.#lifespan;

		const forceUpdate = useForceUpdate();
		const recordRef = useRef();

		if (disabled) {
			recordRef.current = null;
			return;
		}

		// Check record from cache
		let nextRecord = cache.get(id);

		if (!recordRef.current || recordRef.id !== id || (nextRecord && recordRef.current !== nextRecord)) {
			if (!nextRecord) {
				const promise = (async () => {
					try {
						const data = await fetcher(key);

						if (lifespan > 0) {
							setTimeout(() => cache.delete(id), lifespan);
						}

						return data;
					}
					catch (error) {
						cache.delete(id);
						throw error;
					}
				})();

				nextRecord = createRecord(promise);
				cache.set(id, nextRecord);
			}

			recordRef.current = nextRecord;
			recordRef.id = id;
		}

		// Get current record
		const currRecord = recordRef.current;

		if (currRecord.status === RECORD_PENDING) {
			if (readonly) {
				currRecord.promise.finally(forceUpdate);
			}
			else {
				throw currRecord.promise;
			}
		}

		if (currRecord.status === RECORD_REJECTED) {
			throw currRecord.error;
		}

		return currRecord.value;
	}
}

function useForceUpdate () {
	const [, setState] = useState();

	useLayoutEffect(() => {
		setState.m = true;
		return () => setState.m = false;
	}, []);

	return () => {
		if (!setState.m) {
			return;
		}

		setState({});
	};
}

function createRecord (promise) {
	const record = {
		status: RECORD_PENDING,
		promise: promise,
		value: undefined,
		error: undefined,
	};

	promise.then(
		(value) => {
			record.status = RECORD_FULFILLED;
			record.value = value;
		},
		(error) => {
			record.status = RECORD_REJECTED;
			record.error = error;
		},
	);

	return record;
}
