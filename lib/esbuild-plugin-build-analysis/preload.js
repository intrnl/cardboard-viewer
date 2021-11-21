// Unminified.

function __preload (mod, deps) {
	const doc = document;
	const seen = __preload.s || (__preload.s = {});
	const promises = [];

	for (const dep of deps) {
		if (dep in seen) {
			continue;
		}

		seen[dep] = true;

		const css = dep.endsWith('.css');
		const js = dep.endsWith('.js');

		const cssSelector = css ? '[rel="stylesheet"]' : '';

		if (doc.querySelector(`link[href="${dep}"]${cssSelector}`)) {
			continue;
		}

		const link = document.createElement('link');
		link.rel = css ? 'stylesheet' : js ? 'modulepreload' : 'preload';
		link.href = dep;

		document.head.appendChild(link);

		if (css) {
			const promise = new Promise((resolve, reject) => {
				link.addEventListener('load', resolve);
				link.addEventListener('error', reject);
			});

			promises.push(promise);
		}
	}

	return Promise.all(promises).then(mod);
}
