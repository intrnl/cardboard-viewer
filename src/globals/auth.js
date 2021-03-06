import { Store } from '~/lib/global-store';
import { defaultQueryOptions, invalidateQueries } from '@intrnl/rq';

import { API_URL, ResponseError } from '~/api/base.js';

import { qss } from '~/utils/qss.js';


const localKey = 'token';
const noop = () => {};
const cache = defaultQueryOptions.cache;

export let LOGIN_PROMISE = Promise.resolve();
export const STATUS_VERIFYING = 0;
export const STATUS_LOGGED_IN = 1;
export const STATUS_LOGGED_OUT = 2;

export const AuthStore = new Store({
	status: STATUS_VERIFYING,
	key: null,
	user: null,
	profile: null,
});

export const login = ({ key, user }, write = true) => {
	AuthStore.update({ status: STATUS_VERIFYING });

	const promise = verify({ key, user }).then(
		(profile) => {
			AuthStore.update({
				status: STATUS_LOGGED_IN,
				key: key,
				user: user,
				profile: profile,
			});

			if (write) {
				localStorage.setItem(localKey, JSON.stringify({ key, user }));
			}

			invalidateQueries(cache, []);
		},
		(error) => {
			logout(error.response?.status === 401);
			return Promise.reject(error);
		},
	);

	LOGIN_PROMISE = promise.then(noop, noop);
	return promise;
};

export const logout = (write = true) => {
	AuthStore.update({
		status: STATUS_LOGGED_OUT,
		key: null,
		user: null,
		profile: null,
	});

	if (write) {
		localStorage.removeItem(localKey);
	}

	invalidateQueries(cache, []);
};

export const verify = async ({ key, user }) => {
	if (!key || !user) {
		throw new Error('Missing auth credentials');
	}

	const params = qss({ api_key: key, login: user });
	const response = await fetch(`${API_URL}/profile.json?${params}`);

	if (!response.ok) {
		throw new ResponseError(response);
	}

	const profile = await response.json();

	if (profile.name !== user) {
		throw new Error('User name mismatch');
	}

	return profile;
};


login(JSON.parse(localStorage.getItem(localKey) || '{}'), false)
	.catch((error) => console.log(`Not logged in: ${error.message}`));
