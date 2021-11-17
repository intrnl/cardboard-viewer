const BASE_URL = 'https://danbooru.donmai.us';

export async function onRequest ({ request, params }) {
	const { pathname } = params;
	const { search } = new URL(request.url);

	const method = request.method;

	const destination = `${BASE_URL}/${pathname}${search}`;

	request = new Request(destination, request);
	request.headers.set('Origin', BASE_URL);

	let response = await fetch(request);

	response = new Response(response.body, response);
	response.headers.set('x-proxy-debug', JSON.stringify({ pathname, search, method }))

	return response;
}
