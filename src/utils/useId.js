import { useRef } from 'preact/hooks';

let _counter = 0;

export function useId () {
	const ref = useRef();
	return ref.current ??= ('i' + _counter++ + '_');
}
