import { createDeferred } from './utils.js';


export function createQueue (fn, { concurrency = 1, timeout = 0 }) {
	const queue = [];
	let running = false;

	const drain = async () => {
		if (running) {
			return;
		}

		running = true;

		while (queue.length) {
			const promises = queue.splice(0, concurrency)
				.map(([args, deferred]) => run(fn, args, deferred));

			await Promise.all(promises);

			if (queue.length) {
				await sleep(timeout);
			}
		}

		running = false;
	};

	return (...args) => {
		const deferred = createDeferred();

		queue.push([args, deferred]);
		drain();

		return deferred.promise;
	};
}

function sleep (ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run (fn, args, deferred) {
	try {
		const value = await fn(...args);
		deferred.resolve(value);
	}
	catch (error) {
		deferred.reject(error);
	}
}
