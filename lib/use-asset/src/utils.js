export function isObject (value) {
	return value && typeof value === 'object' && !Array.isArray(value);
}

export function stringify (value) {
	return JSON.stringify(value, (_, v) => {
		if (isObject(v)) {
			const keys = Object.keys(v).sort();
			const obj = {};

			for (const key of keys) {
				obj[key] = v[key];
			}

			return obj;
		}

		return v;
	});
}
