import { AuthStore } from '~/src/globals/auth.js';
import { BASE_URL, ResponseError, qss } from '~/src/api/base.js';
import { favorites } from '~/src/api/asset.js';


function request ({ method = 'POST', url, params, body }) {
	const auth = AuthStore.get();
	const query = qss({ api_key: auth.key, login: auth.user, ...params });

	return fetch(`${BASE_URL}${url}?${query}`, {
		method,
		body: body ? JSON.stringify(body) : undefined,
		redirect: 'manual',
	});
}
export async function setFavorite ({ user_id, post_id, favorited }) {
	const auth = AuthStore.get();

	if (auth.profile.id !== user_id) {
		throw new Error('You can\'t favorite as someone else!');
	}

	try {
		const response = await request({
			method: favorited ? 'POST' : 'DELETE',
			url: favorited ? `/favorites` : `/favorites/${post_id}`,
			params: favorited ? { post_id } : null,
		});

		if (!favorited && response.status === 404) {}
		else if (!response.ok && response.type !== 'opaqueredirect') {
			throw new ResponseError(response);
		}

		favorites.set({ user_id, post_id }, { user_id, post_id, favorited });
	}
	catch (error) {
		update.dispose();
		throw new Error(`Failed to favorite post`, { cause: error });
	}
}
