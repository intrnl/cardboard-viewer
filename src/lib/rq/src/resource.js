import { useMemo } from 'preact/hooks';
import { stringify } from '~/lib/stable-stringify';

import { useQuery } from './query.js';


export function useResourceQuery (options) {
	return useMemo(() => {
		const opts = { ...options, suspense: true };
		return createResource(() => useQuery(opts).data);
	}, [stringify(options)]);
}

function createResource (read) {
	return { read };
}
