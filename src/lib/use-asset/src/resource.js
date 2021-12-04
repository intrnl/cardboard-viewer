// Resource is a generic container where data can be read from.

// The resource container removes the need for an additional "logic" component
// that sits on top of a "visual" component just so it can suspend and fetch
// data. The only thing a component needs to know is that there is a container
// that can be read from, it doesn't have to know what it's actually doing.

export function createResource (read) {
	return { read };
}


const cache = new WeakMap();

export function createMappedResource (object) {
	let resource = cache.get(object);

	if (!resource) {
		cache.set(object, resource = createResource(() => object));
	}

	return resource;
}
