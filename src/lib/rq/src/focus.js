const listeners = new Set();
let cleanup;

export function listenFocusChange (listener) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}

export function setFocusHandler (handler) {
	cleanup?.();
	cleanup = handler(notifyListeners);
}

function notifyListeners () {
	for (const listener of listeners) {
		listener();
	}
}


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
