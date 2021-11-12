import { useReducer } from 'preact/hooks';


export function useInputState (initialState) {
	return useReducer(inputReducer, initialState)
}

function inputReducer (_, event) {
	const target = event?.target;

	if (!target) {
		return event;
	}

	switch (target.type) {
		case 'number': return target.valueAsNumber;
		case 'date': return target.valueAsDate;
		default: return target.value;
	}
}
