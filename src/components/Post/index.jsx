import { h } from 'preact';
import { useMemo } from 'preact/hooks';
import { useQuery, useMutation } from '@intrnl/rq';
import { useStore } from '~/lib/global-store';

import clsx from 'clsx';
import { Link } from '~/components/Link';
import { Icon } from '~/components/Icon';
import * as styles from './Post.css';

import HeartIcon from '~/icons/heart.svg';
import RefreshIcon from '~/icons/refresh.svg';

import { AuthStore, STATUS_LOGGED_IN } from '~/globals/auth';
import { getFavoriteStatus } from '~/api/assets.new';
import { setFavoriteStatus } from '~/api/mutations';
import { POST_IMAGE_SMALL_SIZE, GET_IMAGE_SIZE } from '~/api/enums.js';


// <Post />
export function Post (props) {
	const {
		resource,
		search,
		hideFavorite,
		isInFavorite,
		className,
	} = props;

	const data = resource.read();

	const auth = useStore(AuthStore);

	if (!data.id) {
		return null;
	}

	const originalWidth = data.image_width;
	const originalHeight = data.image_height;
	const [width, height] = GET_IMAGE_SIZE(originalWidth, originalHeight, POST_IMAGE_SMALL_SIZE);


	return (
		<article
			className={clsx(styles.post, className, {
				[styles.isChild]: data.parent_id,
				[styles.isParent]: data.has_active_children,
			})}
		>
			<Link className={styles.link} to={`/posts/${data.id}${search ? `?${search}` : ''}`}>
				<img
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
}

export function PostFallback (props) {
	const { className } = props;

	const [width, height] = useMemo(retrieveRandomSize, []);

	return (
		<article className={clsx(styles.post, className)}>
			<div style={{ width, height }} />
		</article>
	);
}

function retrieveRandomSize () {
	const max = POST_IMAGE_SMALL_SIZE;
	const min = POST_IMAGE_SMALL_SIZE / 2;

	const width = getRandomInclusive(min, max);
	const height = getRandomInclusive(min, max);

	return GET_IMAGE_SIZE(width, height, POST_IMAGE_SMALL_SIZE);
}

function getRandomInclusive (min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}


// <Favorite />
function Favorite (props) {
	const { postId, isInFavorite } = props;

	const { status, data, mutate } = useQuery({
		key: ['favorite', postId],
		fetch: getFavoriteStatus,
		revalidateOnFocus: false,
	});

	const mutation = useMutation(setFavoriteStatus, {
		onMutate (variables) {
			// Optimistic update
			mutate(variables, false);
		},
		onSettled () {
			mutate();
		},
	});

	const loading = !isInFavorite && status === 'loading';
	const favorited = data?.favorited ?? isInFavorite;

	const handleClick = () => {
		mutation.mutate({ post_id: postId, favorited: !favorited });
	};


	if (loading) {
		return (
			<div className={styles.favorite}>
				<Icon size={20} src={RefreshIcon} />
			</div>
		);
	}

	return (
		<button
			title={favorited ? 'Unfavorite' : 'Favorite'}
			onClick={handleClick}
			className={clsx(styles.favorite, favorited && styles.isFavorited)}
		>
			<Icon size={20} src={HeartIcon} className={styles.favoriteIcon} />
		</button>
	);
}
