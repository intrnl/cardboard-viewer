import { useLayoutEffect, useRef, useState } from 'preact/hooks';

const UPDATE = 'update';

export class Store {
	#value;
	#events = new EventTarget();

	constructor (value) {
		this.#value = value;
	}

	get () {
		return this.#value;
	}

	set (next) {
		if (!Object.is(this.#value, next)) {
			this.#value = next;
			this.#events.dispatchEvent(new CustomEvent(UPDATE, { detail: next }));
		}
	}

	update (producer) {
		const currValue = this.#value;
		const nextValue = typeof currValue === 'function' ? producer(currValue) : producer;

		this.set(typeof currValue === 'object' ? { ...currValue, ...nextValue } : nextValue);
	}

	subscribe (listener) {
		const callback = (event) => listener(event.detail);

		this.#events.addEventListener(UPDATE, callback);
		return () => this.#events.removeEventListener(UPDATE, callback);
	}
}

export function useStore (store, selector) {
	const selectorRef = useRef(selector);

	const getSnapshot = (value = store.get()) => {
		const selector = selectorRef.current;
		return selector ? selector(value) : value;
	}

	const [value, setValue] = useState(getSnapshot);

	useLayoutEffect(() => {
		selectorRef.current = selector;
	});

	useLayoutEffect(() => {
		return store.subscribe((event) => setValue(getSnapshot(event.detail)));
	}, [store]);

	return value;
}
