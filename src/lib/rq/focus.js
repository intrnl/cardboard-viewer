const listeners = new Set();
let cleanup;

export const listenFocusChange = (listener) => {
	listeners.add(listener);
	return () => listeners.delete(listener);
};

export const setFocusHandler = (handler) => {
	cleanup?.();
	cleanup = handler(notifyListeners);
};

const notifyListeners = () => {
	for (const listener of listeners) {
		listener();
	}
};


setFocusHandler((handleFocus) => {
	const add = globalThis?.addEventListener;
	const remove = globalThis?.removeEventListener;

	if (!add && !remove) {
		return;
	}

	add('visibilitychange', handleFocus);
	add('focus', handleFocus);

	return () => {
		remove('visibilitychange', handleFocus);
		remove('focus', handleFocus);
	};
});
