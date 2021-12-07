import { h, createContext } from 'preact';
import { useContext, useMemo } from 'preact/hooks';


export const defaultQueryOptions = {
	cache: new Map(),

	fetch: null,

	staleTime: 3 * 1000,
	cacheTime: 5 * 60 * 1000,
	revalidateOnMount: true,
	revalidateOnFocus: true,

	suspense: false,
};

const QueryContext = createContext(defaultQueryOptions);

export function useQueryConfig () {
	return useContext(QueryContext);
}

export function QueryProvider (props) {
	const { options, children } = props;

	const mergedOptions = useMemo(
		() => ({ ...defaultQueryOptions, ...options }),
		[options],
	);

	return h(QueryContext.Provider, { value: mergedOptions, children });
}
