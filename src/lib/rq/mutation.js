import { useReducer } from '@intrnl/freak';


const init = () => {
	return {
		status: 'idle',
		data: null,
		error: null,
		mutating: false,
	};
};

export const useMutation = (mutation, options = {}) => {
	const { onMutate, onSuccess, onError, onSettled } = options;
	const [state, update] = useReducer(updateReducer, null, init);

	const mutate = async (variables) => {
		return update.promise ||= (async () => {
			update((prev) => ({
				...prev,
				status: prev.status === 'idle' ? 'loading' : prev.status,
				mutating: true,
			}));

			let context;
			let data;
			let error;

			try {
				context = await onMutate?.(variables);
				data = await mutation(variables);

				update((prev) => ({ ...prev, status: 'success', data, error: null }));
				await onSuccess?.(data, variables, context);
			}
			catch (err) {
				error = err;

				update((prev) => ({ ...prev, status: 'error', data: null, error }));
				await onError?.(error, variables, context);
			}
			finally {
				update.promise = null;

				update((prev) => ({ ...prev, mutating: false }));
				await onSettled?.(data, error, variables, context);
			}
		})();
	};

	const reset = () => {
		if (update.promise) {
			return;
		}

		update(init);
	};

	return { ...state, mutate, reset };
};

const updateReducer = (current, updater) => {
	return updater(current);
};
