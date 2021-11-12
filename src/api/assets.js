import { createAsset, createBatchedFetch } from '~/lib/use-asset';

import { BASE_URL, ResponseError } from '~/src/api/base.js';
import { AuthStore } from '~/src/globals/auth.js';

import { qss } from '~/src/utils/qss.js';


const fetcher = async (url, params) => {
	const auth = AuthStore.get();
	const query = qss({ ...params, api_key: auth.key, login: auth.user });

	const response = await fetch(`${BASE_URL}${url}?${query}`);
	if (!response.ok) throw new ResponseError(response);

	return response.json();
};


export const users = createAsset((id) => {
	return fetcher(`/users/${id}.json`);
}, 30000);


export const posts = createAsset((id) => {
	return fetcher(`/posts/${id}.json`);
}, 30000);

export const postList = createAsset(async (params) => {
	const result = await fetcher(`/posts.json`, params);

	for (const post of result) {
		if (post.id) {
			posts.set(post.id, post);
		}
	}

	return result;
}, 30000);

export const postCount = createAsset(async (tags) => {
	const params = { tags };
	const result = await fetcher(`/counts/posts.json`, params);

	return result.counts.posts
}, 30000);

export const tags = createAsset(createBatchedFetch({
	// We don't want to use its actual ID, only the name.
	id: (x) => x.name,

	fetch: (tags) => {
		const params = { search: { name: tags } };
		return fetcher(`/tags.json`, params);
	},
}), 30000)

export const relatedTags = createAsset((query) => {
	const params = { query };
	return fetcher(`/related_tags.json`, params);
}, 15000);

export const autocompleteTags = createAsset((query) => {
	const params = { search: { query, type: 'tag_query' }, limit: 10 };
	return fetcher(`/autocomplete.json`, params);
}, 5000);

export const popularTags = createAsset(() => {
	return fetcher(`/explore/posts/searches.json`);
}, 30000);

export const favorites = createAsset(createBatchedFetch({
	id: ({ user_id, post_id }) => ({ user_id, post_id }),

	// One quirk about the favorites endpoint is that if two users share the same
	// favorited posts, it would only return one, that means we wouldn't know if
	// the other user had actually favorited it.

	// While the likelihood of having to figure out favorite posts for more than
	// one user in this app is rather slim, we still have to break up the batch
	// in the case it ever happens.
	key: (x) => x.user_id,

	fetch: async (requests) => {
		const user_id = requests[0].user_id;
		let post_id = '';

		for (const request of requests) {
			post_id && (post_id += ',');
			post_id += request.post_id;
		}

		const params = { search: { user_id, post_id } };
		const responses = await fetcher(`/favorites.json`, params);

		// The response returns a list of posts that *are* favorited, and that
		// wouldn't work for us because it means that unfavorited posts will keep
		// requerying whether it's been favorited or not, when clearly it isn't.

		// Our requests contains the fields that we needed from the response, so
		// we're just going to mutate it to include a non-standard field.

		const favorited_set = new Set();

		for (const data of responses) {
			favorited_set.add(data.post_id);
		}

		for (const data of requests) {
			data.favorited = favorited_set.has(data.post_id);
		}

		return requests;
	},
}), 30000);
