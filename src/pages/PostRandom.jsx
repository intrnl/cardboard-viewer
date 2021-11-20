import { useLayoutEffect, useRef } from 'preact/hooks';
import { useNavigate } from 'react-router-dom';

import * as asset from '~/src/api/assets.js';


export default function PostRandomPage () {
	const navigate = useNavigate();
	const valueRef = useRef();

	if (!valueRef.promise) {
		const promise = valueRef.promise = asset.fetcher(`/posts/random.json`)
			.then((post) => {
				asset.posts.set(post.id, post);
				valueRef.current = post.id;
			});

		throw promise;
	}

	if (valueRef.error) {
		throw valueRef.error;
	}

	useLayoutEffect(() => {
		const id = valueRef.current;

		if (id) {
			navigate(`/posts/${id}`, { replace: true });
		}
	});

	return null;
}
