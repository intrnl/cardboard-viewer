export const BASE_URL = 'https://danbooru.donmai.us';
export const BASE_MUTATION_URL = '/proxy';


export class ResponseError extends Error {
	constructor (response) {
		super(`Response error ${response.status}`);
		this.response = response;
	}
}
