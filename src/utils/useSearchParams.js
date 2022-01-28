import { useLocation } from 'react-router-dom';

import { useFactoryMemo } from '~/utils/useFactoryMemo.js';

/**
 * @template {Record<string, string>} T
 * @param {T} init
 * @param {import('react-router-dom').NavigateOptions} options
 * @returns {[T, (next: Partial<T>) => void]}
 */
export function useSearchParams (init) {
	const location = useLocation();

	const search = location.search;
	const params = useFactoryMemo(retrieveSearchParams, [search, init]);

	return params;
}

function retrieveSearchParams (search, init = null) {
	const params = Object.fromEntries(new URLSearchParams(search));
	return { ...init, ...params };
}
