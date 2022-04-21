import { h } from 'preact';
import { useState, useErrorBoundary } from 'preact/hooks';


export const ErrorBoundary = (props) => {
	const { children, fallback } = props;

	const [error, setError] = useState();
	useErrorBoundary(setError);

	if (error) {
		return h(fallback, { error, reset: () => setError() });
	}

	return children;
};

export const useBoundError = (givenError) => {
	const [error, setError] = useState(givenError);

	if (error) {
		throw error;
	}

	return setError;
};
