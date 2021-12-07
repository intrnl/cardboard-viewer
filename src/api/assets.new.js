import { defaultQueryOptions, mutateQuery } from '@intrnl/rq';
import { createBatchedFetch } from '~/lib/batch-fetch';

import { AuthStore, LOGIN_PROMISE } from '~/globals/auth';
import { API_URL, ResponseError } from '~/api/base';

import { qss } from '~/utils/qss';


const cache = defaultQueryOptions.cache;

export async function fetcher (url, params) {
	await LOGIN_PROMISE;

	const auth = AuthStore.get();
	const query = qss({ ...params, api_key: auth.key, login: auth.user });

	const response = await fetch(`${API_URL}${url}?${query}`);

	if (!response.ok) {
		throw new ResponseError(response);
	}

	return response.json();
}


// User
// ['user', id]
export function getUser (key, id) {
	return fetcher(`/users/${id}.json`);
}


/// Posts
// ['post', id]
export function getPost (key, id) {
	return fetcher(`/posts/${id}.json`);
}

// ['post/list', query]
export async function getPostList (key, params) {
	const result = await fetcher(`/posts.json`, params);
	const auth = AuthStore.get();

	for (const post of result) {
		const post_id = post.id;

		if (!post_id) {
			continue;
		}

		mutateQuery(cache, ['post', post_id], post);
	}

	if (auth.profile && params.tags) {
		const { tags } = params;
		const { name } = auth.profile;

		const re = auth.profile._re_ordfav ||= new RegExp(`\\b(?:ord)?fav:${name}\\b`);

		if (re.test(tags)) {
			for (const post of result) {
				const post_id = post.id;

				if (!post_id) {
					continue;
				}

				mutateQuery(cache, ['favorite', post_id], { favorited: true });
			}
		}
	}

	return result;
}

// ['post/count', tags]
export async function getPostCount (key, tags) {
	const params = { tags };
	const result = await fetcher(`/counts/posts.json`, params);

	return result.counts.posts;
}


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
export function getFavoriteStatus (key, post_id) {
	return batchFavoriteStatus({ post_id });
}


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
export function getTag (key, name) {
	return batchTags(name);
}

// ['tag/autocomplete', query]
export function getTagCompletion (key, query) {
	const params = { search: { query, type: 'tag_query' }, limit: 10 };
	return fetcher(`/autocomplete.json`, params);
}

// ['tag/popular', date]
export function getPopularTags (key, specifiedDate) {
	const date = new Date(specifiedDate);
	const params = { date: date.toISOString() };

	// Array<[tag: string, popularity: number]>
	return fetcher(`/explore/posts/searches.json`, params);
}
