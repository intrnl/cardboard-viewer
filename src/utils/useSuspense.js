import { useState } from '@intrnl/freak';


export const useSuspense = () => {
	const [promise, setPromise] = useState();

	if (promise) {
		throw promise.finally(setPromise);
	}

	return setPromise;
};
