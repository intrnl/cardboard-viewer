import { useReducer } from 'preact/hooks';


function init () {
	return {
		promise: null,
		status: 'idle',
		data: null,
		error: null,
	};
}

export function useMutation (mutation, options) {
	const { onMutate, onSuccess, onError, onSettled } = options;
	const [state, update] = useReducer(updateReducer, null, init);

	const mutate = async (variables) => {
		return state.promise ||= (async () => {
			update((prev) => ({ ...prev, status: 'loading' }));

			let context;

			try {
				context = await onMutate?.(variables);
				const data = await mutation(variables);

				update((prev) => ({ ...prev, status: 'success', data, error: null }));
				onSuccess?.(data, variables, context);
			}
			catch (error) {
				update((prev) => ({ ...prev, status: 'error', data: null, error }));
				onError?.(error, variables, context);
			}
			finally {
				state.promise = null;
				onSettled?.(variables, context);
			}
		});
	};

	const reset = () => {
		if (state.promise) {
			return;
		}

		update(init);
	};

	return { ...state, mutate, reset };
}

function updateReducer (current, updater) {
	return updater(current);
}
