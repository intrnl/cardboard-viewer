import { useLocation } from '~/components/Router';

import { useFactoryMemo } from '~/utils/useFactoryMemo.js';

/**
 * @template {Record<string, string>} T
 * @param {T} init
 * @param {*} options
 * @returns {[T, (next: Partial<T>) => void]}
 */
export const useSearchParams = (init) => {
	const location = useLocation();

	const search = location.search;
	const params = useFactoryMemo(retrieveSearchParams, [search, init]);

	return params;
};

const retrieveSearchParams = (search, init = null) => {
	const params = Object.fromEntries(new URLSearchParams(search));
	return { ...init, ...params };
};
