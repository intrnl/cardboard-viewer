import { h } from 'preact';
import { useMemo } from 'preact/hooks';
import { useQuery, useMutation } from '@intrnl/rq';
import { useStore } from '~/lib/global-store';

import clsx from 'clsx';
import { Link } from '~/components/Link';
import { Icon } from '~/components/Icon';
import * as styles from './Post.css';

import HeartIcon from '~/icons/heart.svg';

import { AuthStore, STATUS_LOGGED_IN } from '~/globals/auth';
import { getFavoriteStatus } from '~/api/assets';
import { setFavoriteStatus } from '~/api/mutations';
import { POST_IMAGE_SMALL_SIZE, GET_IMAGE_SIZE } from '~/api/enums';


// <Post />
export const Post = (props) => {
	const {
		resource,
		search,
		hideFavorite,
		isInFavorite,
		className,
	} = props;

	const data = resource.read();

	const auth = useStore(AuthStore);

	const originalWidth = data.image_width;
	const originalHeight = data.image_height;
	const [width, height] = GET_IMAGE_SIZE(originalWidth, originalHeight, POST_IMAGE_SMALL_SIZE);


	return (
		<article
			className={clsx(styles.post, className, {
				[styles.isChild]: data.parent_id,
				[styles.isParent]: data.has_active_children,
				[styles.isPending]: data.is_pending,
			})}
		>
			<Link className={styles.link} to={`/posts/${data.id}${search ? `?${search}` : ''}`}>
				<img
					key={data.preview_file_url}
					width={width}
					height={height}
					alt={`post #${data.id}`}
					src={data.preview_file_url}
					className={styles.image}
				/>
			</Link>

			{!hideFavorite && auth.status === STATUS_LOGGED_IN && (
				<Favorite postId={data.id} isInFavorite={isInFavorite} />
			)}
		</article>
	);
};

export const PostFallback = (props) => {
	const { className } = props;

	const [width, height] = useMemo(retrieveRandomSize, []);

	return (
		<article className={clsx(styles.post, className)}>
			<div style={{ width, height }} />
		</article>
	);
};

const retrieveRandomSize = () => {
	const max = POST_IMAGE_SMALL_SIZE;
	const min = POST_IMAGE_SMALL_SIZE / 2;

	const width = getRandomInclusive(min, max);
	const height = getRandomInclusive(min, max);

	return GET_IMAGE_SIZE(width, height, POST_IMAGE_SMALL_SIZE);
};

const getRandomInclusive = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};


// <Favorite />
const Favorite = (props) => {
	const { postId, isInFavorite } = props;

	const { status, data, mutate } = useQuery({
		key: ['favorite', postId],
		fetch: getFavoriteStatus,
		revalidateOnFocus: false,
	});

	const mutation = useMutation(setFavoriteStatus, {
		onMutate: (variables) => {
			// Optimistic update
			mutate(variables, false);
		},
		onSettled: () => {
			mutate();
		},
	});

	const loading = !isInFavorite && status === 'loading';
	const favorited = data?.favorited ?? isInFavorite;

	const handleClick = () => {
		mutation.mutate({ post_id: postId, favorited: !favorited });
	};


	return (
		<button
			title={favorited ? 'Unfavorite' : 'Favorite'}
			disabled={loading}
			onClick={handleClick}
			className={clsx(styles.favorite, favorited && styles.isFavorited)}
		>
			<Icon size={20} src={HeartIcon} className={styles.favoriteIcon} />
		</button>
	);
};
