import { useLocation, useNavigate } from 'react-router-dom';

import { qss } from '~/src/api/base.js';
import { useFactoryMemo } from '~/src/utils/useFactoryMemo.js';

/**
 * @template {Record<string, string>} T
 * @param {T} init
 * @param {import('react-router-dom').NavigateOptions} options
 * @returns {[T, (next: Partial<T>) => void]}
 */
export function useSearchParams (init, options) {
	const navigate = useNavigate();
	const location = useLocation();

	const search = location.search;
	const params = useFactoryMemo(retrieveSearchParams, [search, init]);

	const setParams = (next) => {
		const url = '?' + qss({ ...params, ...next });
		navigate(url, options);
	};

	return [params, setParams];
}

function retrieveSearchParams (search, init = null) {
	const params = Object.fromEntries(new URLSearchParams(search));
	return { ...init, ...params };
}
