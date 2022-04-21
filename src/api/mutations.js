import { AuthStore } from '~/globals/auth.js';
import { PROXY_URL, ResponseError } from '~/api/base.js';

import { qss } from '~/utils/qss.js';


const request = ({ method = 'POST', url, params, body }) => {
	const auth = AuthStore.get();
	const query = qss({ api_key: auth.key, login: auth.user, ...params });

	return fetch(`${PROXY_URL}${url}?${query}`, {
		method,
		body: body ? JSON.stringify(body) : undefined,
		redirect: 'manual',
	});
};

export const setFavoriteStatus = async ({ post_id, favorited }) => {
	const response = await request({
		method: favorited ? 'POST' : 'DELETE',
		url: favorited ? `/favorites` : `/favorites/${post_id}`,
		params: favorited ? { post_id } : null,
	});

	if (!favorited && response.status === 404) {
		// Do nothing, it's already been favorited.
	}
	else if (!response.ok && response.type !== 'opaqueredirect') {
		throw new ResponseError(response);
	}

	return favorited;
};
