export const API_URL = import.meta.env.VITE_API_URL;
export const PROXY_URL = import.meta.env.VITE_PROXY_URL;


export class ResponseError extends Error {
	constructor (response) {
		super(`Response error ${response.status}`);
		this.response = response;
	}
}
