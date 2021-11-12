import { h } from 'preact';
import { Suspense } from 'preact/compat';
import { Link } from 'react-router-dom';
import { useStore } from '~/lib/global-store';

import clsx from 'clsx';
import * as styles from '~/src/styles/components/Post.module.css';
import { Icon } from '~/src/components/Icon.jsx';

import HeartIcon from '~/src/icons/heart.svg?url';
import RefreshIcon from '~/src/icons/refresh.svg?url';

import { AuthStore, STATUS_LOGGED_IN } from '~/src/globals/auth';
import * as asset from '~/src/api/asset.js';
import { setFavorite } from '~/src/api/mutation.js';
import { POST_IMAGE_SMALL_SIZE, GET_IMAGE_SIZE } from '~/src/api/enums.js';

import { qss } from '~/src/utils/qss.js';
import { useSuspense } from '~/src/utils/useSuspense';
import { useSearchParams } from '~/src/utils/useSearchParams';


export function Post (props) {
	const { resource, className } = props;

	const data = resource.read();

	const auth = useStore(AuthStore);
	const [{ query }] = useSearchParams();

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
			<Link to={`/posts/${data.id}?${qss({ query })}`}>
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
	}

	return (
		<button
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
