import { AuthStore } from '~/globals/auth.js';
import { PROXY_URL, ResponseError } from '~/api/base.js';
import { favorites } from '~/api/assets.js';

import { qss } from '~/utils/qss.js';


function request ({ method = 'POST', url, params, body }) {
	const auth = AuthStore.get();
	const query = qss({ api_key: auth.key, login: auth.user, ...params });

	return fetch(`${PROXY_URL}${url}?${query}`, {
		method,
		body: body ? JSON.stringify(body) : undefined,
		redirect: 'manual',
	});
}

export async function setFavorite ({ user_id, post_id, favorited }) {
	const current = favorites.get({ user_id, post_id });
	const auth = AuthStore.get();

	if (auth.profile.id !== user_id) {
		throw new Error('You can\'t favorite as someone else!');
	}
	if (current.favorited === favorited) {
		return;
	}

	try {
		const response = await request({
			method: favorited ? 'POST' : 'DELETE',
			url: favorited ? `/favorites` : `/favorites/${post_id}`,
			params: favorited ? { post_id } : null,
		});

		if (!favorited && response.status === 404) {
			// Do nothing, it means that it's already been unfavorited.
		}
		else if (!response.ok && response.type !== 'opaqueredirect') {
			throw new ResponseError(response);
		}

		favorites.set({ user_id, post_id }, { user_id, post_id, favorited });
	}
	catch (error) {
		throw new Error(`Failed to favorite post`, { cause: error });
	}
}
