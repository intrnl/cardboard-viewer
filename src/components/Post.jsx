import { h } from 'preact';
import { Suspense } from 'preact/compat';
import { useMemo } from 'preact/hooks';
import { useStore } from '~/lib/global-store';

import clsx from 'clsx';
import { Link } from '~/src/components/Link.jsx';
import { Icon } from '~/src/components/Icon.jsx';
import * as styles from '~/src/styles/components/Post.module.css';

import HeartIcon from '~/src/icons/heart.svg?url';
import RefreshIcon from '~/src/icons/refresh.svg?url';

import { AuthStore, STATUS_LOGGED_IN } from '~/src/globals/auth';
import * as asset from '~/src/api/assets.js';
import { setFavorite } from '~/src/api/mutations.js';
import { POST_IMAGE_SMALL_SIZE, GET_IMAGE_SIZE } from '~/src/api/enums.js';

import { useSuspense } from '~/src/utils/useSuspense.js';


// <Post />
export function Post (props) {
	const { resource, className, search } = props;

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
			<Link to={`/posts/${data.id}${search ? `?${search}` : ''}`}>
				<img
					width={width}
					height={height}
					alt={`post #${data.id}`}
					src={data.preview_file_url}
				/>
			</Link>

			{auth.status === STATUS_LOGGED_IN && (
				<Suspense fallback={<FavoriteFallback />}>
					<Favorite postId={data.id} userId={auth.profile.id} />
				</Suspense>
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
	const { postId, userId } = props;

	const suspend = useSuspense();

	const data = asset.favorites.read({ post_id: postId, user_id: userId });
	const favorited = data.favorited;

	const handleClick = () => {
		const promise = setFavorite({
			post_id: postId,
			user_id: userId,
			favorited: !favorited,
		});

		suspend(promise);
	};


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

function FavoriteFallback () {
	return (
		<div className={clsx(styles.favorite)}>
			<Icon size={20} src={RefreshIcon} />
		</div>
	);
}
