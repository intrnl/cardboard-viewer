import { h, Provider, createContext, useContext, useMemo } from '@intrnl/freak';

import { stableStringify } from '@intrnl/stable-stringify';


export const defaultQueryOptions = {
	cache: new Map(),

	staleTime: 3 * 1000,
	cacheTime: 5 * 60 * 1000,
	revalidateOnMount: true,
	revalidateOnFocus: true,

	isDataEqual: (prev, next) =>
		prev === next || stableStringify(prev) === stableStringify(next)
			? prev
			: next,
};

const QueryContext = createContext(defaultQueryOptions);

export const useQueryConfig = () => {
	return useContext(QueryContext);
};

export const QueryProvider = (props) => {
	const { options: next, children } = props;

	const prev = useQueryConfig();

	const mergedOptions = useMemo(
		() => ({ ...prev, ...next }),
		[next],
	);

	return h(Provider, { context: QueryContext, value: mergedOptions, children });
};
