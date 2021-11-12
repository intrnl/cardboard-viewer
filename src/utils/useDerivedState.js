import { useState, useLayoutEffect } from 'preact/hooks';


export function useDerivedState (original) {
	const [value, setValue] = useState(original);

	useLayoutEffect(() => {
		if (value !== original) {
			setValue(original);
		}
	}, [original]);

	return [value, setValue];
}
