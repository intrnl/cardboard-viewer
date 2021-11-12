import { useState } from 'preact/hooks';


export function useSuspense () {
	const [promise, setPromise] = useState();

	if (promise) {
		throw promise.finally(setPromise);
	}

	return setPromise;
}
