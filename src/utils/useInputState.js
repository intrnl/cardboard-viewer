import { useReducer } from '@intrnl/freak';


export const useInputState = (initialState) => {
	return useReducer(inputReducer, initialState)
};

const inputReducer = (_, event) => {
	const target = event?.target;

	if (!target) {
		return event;
	}

	switch (target.type) {
		case 'number': return target.valueAsNumber;
		case 'date': return target.valueAsDate;
		default: return target.value;
	}
};
