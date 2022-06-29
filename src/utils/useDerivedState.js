import { useState } from 'preact/hooks';


export const useDerivedState = (original) => {
	const [settled, setSettled] = useState(original);
	const [value, setValue] = useState(original);

	if (settled !== original) {
		setValue(original);
		setSettled(original);
	}

	return [value, setValue];
};
