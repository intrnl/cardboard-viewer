import { useState } from 'preact/hooks';


export const useSuspense = () => {
	const [promise, setPromise] = useState();

	if (promise) {
		throw promise.finally(setPromise);
	}

	return setPromise;
};
