const BASE_URL = 'https://danbooru.donmai.us';

export async function onRequest ({ request, params }) {
	const { pathname } = params;
	const { search } = new URL(request.url);

	const destination = `${BASE_URL}/${pathname}${search}`;

	console.log(`proxy: /${pathname}`);

	request = new Request(destination, request);
	request.headers.set('Origin', BASE_URL);

	const response = await fetch(request);

	return response;
}
