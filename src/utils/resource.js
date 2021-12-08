const map = new WeakMap();

export function createMappedResource (data) {
	let resource = map.get(data);

	if (!resource) {
		map.set(data, resource = createResource(() => data));
	}

	return resource;
}

export function createResource (read) {
	return { read };
}
