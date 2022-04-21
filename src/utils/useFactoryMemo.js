import { useMemo } from 'preact/hooks';

/**
 * @template {((...args: any[]) => any)} T
 * @param {T} factory
 * @param {Parameters<T>} args
 * @returns {ReturnType<T>}
 */
export const useFactoryMemo = (factory, args) => {
	return useMemo(() => factory(...args), args);
};
