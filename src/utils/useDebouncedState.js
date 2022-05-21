import { useState, useRef, useLayoutEffect } from '@intrnl/freak';


export const useDebouncedState = (value, timeout) => {
	const [state, setState] = useState(value);
	const timeoutRef = useRef(value);

	useLayoutEffect(() => {
		if (value !== state) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = setTimeout(setState, timeout, value);
		}
	}, [state, value]);

	return state;
};
