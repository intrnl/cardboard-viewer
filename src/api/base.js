export const API_URL = process.env.APP_API_URL;
export const PROXY_URL = process.env.APP_PROXY_URL;


export class ResponseError extends Error {
	constructor (response) {
		super(`Response error ${response.status}`);
		this.response = response;
	}
}
