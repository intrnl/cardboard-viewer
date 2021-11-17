const BASE_URL = 'https://danbooru.donmai.us';

export async function onRequest ({ request, params }) {
	const { pathname } = params;
	const { search } = new URL(request.url);

	const destination = `${BASE_URL}/${pathname.join('/')}${search}`;

	request = new Request(destination, request);
	request.headers.set('Origin', BASE_URL);

	let response = await fetch(request);

	response = new Response(response.body, response);

	return response;
}
