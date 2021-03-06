import { createBatchedFetch } from '~/lib/batch-fetch';

import { AuthStore, LOGIN_PROMISE } from '~/globals/auth';
import { API_URL, ResponseError } from '~/api/base';

import { qss } from '~/utils/qss';


export const fetcher = async (url, params) => {
	await LOGIN_PROMISE;

	const auth = AuthStore.get();
	const query = qss({ ...params, api_key: auth.key, login: auth.user });

	const response = await fetch(`${API_URL}${url}?${query}`);

	if (!response.ok) {
		let data;

		try {
			data = await response.json();
		} catch {}

		throw new ResponseError(response, data);
	}

	return response.json();
};


// User
// ['user', id]
export const getUser = (key, id) => {
	return fetcher(`/users/${id}.json`);
};


/// Posts
// ['post', id]
export const getPost = (key, id) => {
	return fetcher(`/posts/${id}.json`);
};

// ['post/list', query]
const POST_LIST_FIELDS = [
	'id',
	'parent_id',
	'has_active_children',
	'is_pending',
	'is_deleted',
	'preview_file_url',
	'image_width',
	'image_height',
].join(',');

export const getPostList = async (key, params) => {
	params = { only: POST_LIST_FIELDS, ...params };
	return fetcher(`/posts.json`, params);
};

// ['post/count', tags]
export const getPostCount = async (key, tags) => {
	const params = { tags };
	const result = await fetcher(`/counts/posts.json`, params);

	return result.counts.posts;
};


// Favorited posts
const batchFavoriteStatus = createBatchedFetch({
	id: ({ post_id }) => ({ post_id }),
	limit: 20,

	async fetch (requests) {
		const auth = AuthStore.get();

		let user_id = auth.profile.id;
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
});

// ['favorite', post_id]
export const getFavoriteStatus = (key, post_id) => {
	return batchFavoriteStatus({ post_id });
};


/// Tags
const batchTags = createBatchedFetch({
	// We don't want to use its actual ID, only the name.
	id: (x) => x.name,
	limit: 20,

	fetch (tags) {
		const params = { search: { name: tags } };
		return fetcher(`/tags.json`, params);
	},
});

// ['tag', name]
export const getTag = (key, name) => {
	return batchTags(name);
};

// ['tag/autocomplete', query]
export const getTagCompletion = (key, query) => {
	const params = { search: { query, type: 'tag_query' }, limit: 10 };
	return fetcher(`/autocomplete.json`, params);
};

// ['tag/related', tags]
export const getRelatedTags = async (key, query) => {
	const params = { query };
	const response = await fetcher(`/related_tag.json`, params);

	// Array<[tag: string, type: TagType]>
	return response.tags;
};

// ['tag/popular', date]
export const getPopularTags = (key, specifiedDate) => {
	const params = { date: specifiedDate };

	// Array<[tag: string, popularity: number]>
	return fetcher(`/explore/posts/searches.json`, params);
};
