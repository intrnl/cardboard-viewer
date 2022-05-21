import { useState, useLayoutEffect } from '@intrnl/freak';


export const useDerivedState = (original) => {
	const [value, setValue] = useState(original);

	useLayoutEffect(() => {
		if (value !== original) {
			setValue(original);
		}
	}, [original]);

	return [value, setValue];
};
