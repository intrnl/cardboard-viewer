import { useLayoutEffect, useRef } from 'preact/hooks';
import { useNavigate } from 'react-router-dom';
import { useMutate } from '@intrnl/rq';

import { fetcher } from '~/api/assets';


export default function PostRandomPage () {
	const navigate = useNavigate();
	const mutate = useMutate();

	const valueRef = useRef();

	if (!valueRef.promise) {
		const promise = valueRef.promise = fetcher(`/posts/random.json`)
			.then((post) => {
				if (!post.id) {
					valueRef.promise = null;
					return;
				}

				mutate(['post', post.id], post, false);
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
