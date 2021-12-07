import { useState } from 'preact/hooks';


export function useErrorBoundary (caughtError) {
	const [error, setError] = useState();

	if (caughtError) {
		throw caughtError;
	}

	if (error) {
		throw error;
	}

	return setError;
}
