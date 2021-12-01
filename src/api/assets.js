import { createAsset, createBatchedFetch } from '~/lib/use-asset';

import { API_URL, ResponseError } from '~/src/api/base.js';
import { AuthStore, LOGIN_PROMISE } from '~/src/globals/auth.js';

import { qss } from '~/src/utils/qss.js';


export const fetcher = async (url, params) => {
	await LOGIN_PROMISE;

	const auth = AuthStore.get();
	const query = qss({ ...params, api_key: auth.key, login: auth.user });

	const response = await fetch(`${API_URL}${url}?${query}`);
	if (!response.ok) throw new ResponseError(response);

	return response.json();
};


export const users = createAsset((id) => {
	return fetcher(`/users/${id}.json`);
}, 90000);


export const posts = createAsset((id) => {
	return fetcher(`/posts/${id}.json`);
}, 90000);

export const postList = createAsset(async (params) => {
	const auth = AuthStore.get();
	const result = await fetcher(`/posts.json`, params);

	for (const post of result) {
		const post_id = post.id;

		if (!post_id) {
			continue;
		}

		posts.set(post_id, post);
	}

	if (auth.profile && params.tags) {
		const { tags } = params;
		const { name, id: user_id } = auth.profile;

		const re = auth.profile._re_ordfav ||= new RegExp(`\\b(?:ord)?fav:${name}\\b`);

		if (re.test(tags)) {
			for (const post of result) {
				const post_id = post.id;

				if (!post_id) {
					continue;
				}

				favorites.set({ user_id, post_id }, { user_id, post_id, favorited: true });
			}
		}
	}

	return result;
}, 90000);

export const postCount = createAsset(async (tags) => {
	const params = { tags };
	const result = await fetcher(`/counts/posts.json`, params);

	return result.counts.posts
}, 90000);

export const tags = createAsset(createBatchedFetch({
	// We don't want to use its actual ID, only the name.
	id: (x) => x.name,
	limit: 20,

	fetch: (tags) => {
		const params = { search: { name: tags } };
		return fetcher(`/tags.json`, params);
	},
}), 90000);

export const autocompleteTags = createAsset((query) => {
	const params = { search: { query, type: 'tag_query' }, limit: 10 };

	return fetcher(`/autocomplete.json`, params);
}, 5000);

export const relatedTags = createAsset(async (query) => {
	const params = { query };
	const response = await fetcher(`/related_tag.json`, params);

	// Array<[tag: string, type: TagType]>
	return response.tags;
}, 90000);

export const popularTags = createAsset(() => {
	const date = new Date();
	date.setDate(date.getDate() - 1);

	const params = { date: date.toISOString() };

	// Array<[tag: string, popularity: number]>
	return fetcher(`/explore/posts/searches.json`, params);
}, 90000);

export const favorites = createAsset(createBatchedFetch({
	id: ({ user_id, post_id }) => ({ user_id, post_id }),
	limit: 20,

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
}), 90000);
