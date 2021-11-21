export const API_URL = process.env.VITE_API_URL;
export const PROXY_URL = process.env.VITE_PROXY_URL;


export class ResponseError extends Error {
	constructor (response) {
		super(`Response error ${response.status}`);
		this.response = response;
	}
}
