import { Store } from '~/lib/global-store';

import { BASE_URL, ResponseError } from '~/src/api/base.js';

import { qss } from '~/src/utils/qss.js';


const localKey = 'token';

export const STATUS_VERIFYING = 0;
export const STATUS_LOGGED_IN = 1;
export const STATUS_LOGGED_OUT = 2;

export const AuthStore = new Store({
	status: STATUS_VERIFYING,
	key: null,
	user: null,
	profile: null,
});

window._AuthStore = AuthStore;

login(JSON.parse(localStorage.getItem(localKey) || '{}'), false)
	.catch((error) => console.log(`Not logged in: ${error.message}`));

export function login ({ key, user }, write = true) {
	AuthStore.update({ status: STATUS_VERIFYING });

	return verify({ key, user }).then(
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
		},
		(error) => {
			logout(error.response?.status === 401);
			return Promise.reject(error);
		},
	);
}

export function logout (write = true) {
	AuthStore.update({
		status: STATUS_LOGGED_OUT,
		key: null,
		user: null,
		profile: null,
	});

	if (write) {
		localStorage.removeItem(localKey);
	}
}

export async function verify ({ key, user }) {
	if (!key || !user) {
		throw new Error('Missing auth credentials');
	}

	const params = qss({ api_key: key, login: user });
	const response = await fetch(`${BASE_URL}/profile.json?${params}`);

	if (!response.ok) {
		throw new ResponseError(response);
	}

	const profile = await response.json();

	if (profile.name !== user) {
		throw new Error('User name mismatch');
	}

	return profile;
}
