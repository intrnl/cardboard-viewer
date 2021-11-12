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

export class ResponseError extends Error {
	constructor (response) {
		super(`Response error ${response.status}`);
		this.response = response;
	}
}
