export const ACTION_POP = 'POP';
export const ACTION_PUSH = 'PUSH';
export const ACTION_REPLACE = 'REPLACE';

const BeforeUnloadEventType = 'beforeunload';
const PopStateEventType = 'popstate';

export const createBrowserHistory = (options = {}) => {
	const { window = document.defaultView } = options;
	const globalHistory = window.history;

	const getIndexAndLocation = () => {
		const { pathname, search, hash } = window.location;
		const state = globalHistory.state || {};

		const loc = {
			pathname,
			search,
			hash,
			state: state.usr,
			key: state.key || 'default',
		};

		return [state.idx, loc];
	};

	const listeners = createEvents();
	const blockers = createEvents();

	let blockedPopTx = null;
	let action = ACTION_POP;
	let [index, location] = getIndexAndLocation();

	if (index == null) {
		index = 0;
		globalHistory.replaceState({ ...globalHistory.state, idx: index }, '');
	}

	const handlePop = () => {
		if (blockedPopTx) {
			blockers.call(blockedPopTx);
			blockedPopTx = null;
		} else {
			const nextAction = ACTION_POP;
			const [nextIndex, nextLocation] = getIndexAndLocation();

			if (blockers.length && nextIndex != null) {
				const delta = index - nextIndex;
				if (delta) {
					blockedPopTx = {
						action: nextAction,
						location: nextLocation,
						retry() {
							go(delta * -1);
						},
					};
					go(delta);
				}
			} else {
				applyTx(nextAction);
			}
		}
	};

	const createHref = (to) => {
		return typeof to !== 'string' ? createPath(to) : to;
	};

	const getNextLocation = (to, state = null) => {
		return {
			pathname: location.pathname,
			hash: '',
			search: '',
			...(typeof to === 'string' ? parsePath(to) : to),
			state,
			key: createKey(),
		};
	};

	const getHistoryStateAndUrl = (nextLocation, index) => {
		return [
			{
				usr: nextLocation.state,
				key: nextLocation.key,
				idx: index,
			},
			createHref(nextLocation),
		];
	};

	const allowTx = (action2, location2, retry) => {
		return (
			!blockers.length ||
			(blockers.call({ action: action2, location: location2, retry }), false)
		);
	};

	const applyTx = (nextAction) => {
		action = nextAction;
		[index, location] = getIndexAndLocation();
		listeners.call({ action, location });
	};

	const push = (to, state) => {
		const nextAction = ACTION_PUSH;
		const nextLocation = getNextLocation(to, state);

		const retry = () => {
			push(to, state);
		};

		if (allowTx(nextAction, nextLocation, retry)) {
			const [historyState, url] = getHistoryStateAndUrl(nextLocation, index + 1);

			try {
				globalHistory.pushState(historyState, '', url);
			} catch (error) {
				window.location.assign(url);
			}

			applyTx(nextAction);
		}
	};

	const replace = (to, state) => {
		const nextAction = ACTION_REPLACE;
		const nextLocation = getNextLocation(to, state);

		const retry = () => {
			replace(to, state);
		};

		if (allowTx(nextAction, nextLocation, retry)) {
			let [historyState, url] = getHistoryStateAndUrl(nextLocation, index);
			globalHistory.replaceState(historyState, '', url);
			applyTx(nextAction);
		}
	};

	const go = (delta) => {
		globalHistory.go(delta);
	};

	const back = () => {
		go(-1);
	};

	const forward = () => {
		go(1);
	};

	const listen = (listener) => {
		return listeners.push(listener);
	};

	const block = (blocker) => {
		const unblock = blockers.push(blocker);

		if (blockers.length === 1) {
			window.addEventListener(BeforeUnloadEventType, promptBeforeUnload);
		}

		return () => {
			unblock();

			if (blockers.length === 0) {
				window.removeEventListener(BeforeUnloadEventType, promptBeforeUnload);
			}
		};
	};

	const instance = {
		get action() {
			return action;
		},
		get location() {
			return location;
		},

		createHref,

		push,
		replace,
		go,
		back,
		forward,

		listen,
		block,
	};

	window.addEventListener(PopStateEventType, handlePop);
	return instance;
};

const promptBeforeUnload = (event) => {
	event.preventDefault();
	event.returnValue = '';
};

const createEvents = () => {
	const handlers = [];

	const push = (fn) => {
		handlers.push(fn);

		return () => {
			const idx = handlers.indexOf(fn);

			if (idx !== -1) {
				handlers.splice(idx, 1);
			}
		};
	};

	const call = (data) => {
		for (let i = 0; i < handlers.length; i++) {
			const handler = handlers[i];
			handler(data);
		}
	};

	return {
		get length() {
			return handlers.length;
		},

		push,
		call,
	};
};

const createKey = () => {
	return Math.random().toString(36).slice(2, 10);
};

export const createPath = (to) => {
	const search = to.search;
	const hash = to.hash;
	let pathname = to.pathname;

	if (search && search !== '?') {
		pathname += search[0] === '?' ? search : '?' + search;
	}
	if (hash && hash !== '#') {
		pathname += hash[0] === '#' ? hash : '#' + hash;
	}

	return pathname;
};

export const parsePath = (path) => {
	const parsed = {};

	if (path) {
		let hash = path.indexOf('#');

		if (hash >= 0) {
			parsed.hash = path.slice(hash);
			path = path.slice(0, hash);
		}

		let search = path.indexOf('?');

		if (search >= 0) {
			parsed.search = path.slice(search);
			path = path.slice(0, search);
		}

		if (path) {
			parsed.pathname = path;
		}
	}
	return parsed;
};
