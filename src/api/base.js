const localKey = 'baseUrl';

export const DEFAULT_BASE_URL = 'https://danbooru.donmai.us';
export let BASE_URL = localStorage.getItem(localKey) || DEFAULT_BASE_URL;


export function setBaseUrl (baseUrl, save = true) {
	baseUrl = baseUrl.replace(/\/+$/, '');
	
	if (baseUrl === BASE_URL) {
		return;
	}

	BASE_URL = baseUrl;

	if (save) {
		localStorage.setItem(localKey, baseUrl);
	}
}


const enc = encodeURIComponent;

export function qss (obj, nested = '') {
	let res = '';

	const prev = nested ? '[' : '';
	const next = nested ? ']' : '';

	for (const key in obj) {
		const value = obj[key];
		const keyed = prev + key + next;

		if (value == null) {
			continue;
		}

		if (Array.isArray(value)) {
			for (const val of value) {
				res && (res += '&');
				res += enc(nested + keyed + '[]') + '=' + enc(val);
			}

			continue;
		}

		res && (res += '&');

		if (typeof value === 'object') {
			res += qss(value, nested + keyed);
		}
		else {
			res += enc(nested + keyed) + '=' + enc(value);
		}
	}

	return res
}


export class ResponseError extends Error {
	constructor (response) {
		super(`Response error ${response.status}`);
		this.response = response;
	}
}
