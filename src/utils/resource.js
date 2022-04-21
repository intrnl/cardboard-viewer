const map = new WeakMap();

export const createMappedResource = (data) => {
	let resource = map.get(data);

	if (!resource) {
		map.set(data, resource = createResource(() => data));
	}

	return resource;
};

export const createResource = (read) => {
	return { read };
};
