import { h, Fragment } from 'preact';
import { Suspense, lazy } from 'preact/compat';
import { useQuery, useMutation } from '@intrnl/rq';
import { useStore } from '~/lib/global-store';

import clsx from 'clsx';
import { useParams, Navigate } from '~/components/Router';
import { SideView, Main, Aside } from '~/layouts/SideView';
import { Card } from '~/components/Card';
import { Button } from '~/components/Button';
import { Icon } from '~/components/Icon';
import { PostsRelationship } from '~/components/PostsRelationship';
import { Tag } from '~/components/Tag';
import * as styles from './PostDetails.css';

import HeartIcon from '~/icons/heart.svg';
import DownloadIcon from '~/icons/download.svg';

import { AuthStore, STATUS_LOGGED_IN } from '~/globals/auth';
import { getFavoriteStatus, getPost } from '~/api/assets';
import { setFavoriteStatus } from '~/api/mutations';
import { createTagResource } from '~/api/resource';
import {
	POST_IMAGE_LARGE_SIZE,
	GET_IMAGE_CEIL,

	TAG_CATEGORY_GENERAL,
	TAG_CATEGORY_ARTIST,
	TAG_CATEGORY_COPYRIGHT,
	TAG_CATEGORY_CHARACTER,
	TAG_CATEGORY_META,
} from '~/api/enums';

const NotFound = lazy(() => import('~/pages/NotFound'));


const PostDetailsPage = () => {
	const { id } = useParams();

	const idNum = parseInt(id);
	const invalid = Number.isNaN(idNum) || Math.sign(idNum) !== 1;

	const { data: post, error } = useQuery({
		disabled: invalid,
		key: ['post', idNum],
		fetch: getPost,
		staleTime: 60000,
		suspense: true,
		errorBoundary: false,
	});


	if (error) {
		if (error?.response.status === 404) {
			return <NotFound />
		}

		throw error;
	}

	if (invalid) {
		return <Navigate to='/' replace />
	}

	return (
		<SideView>
			<Main className={styles.main}>
				<PostDetails post={post} />
			</Main>

			<Aside>
				<PostTags post={post} />
			</Aside>
		</SideView>
	);
};

export default PostDetailsPage;


// <PostTags />
const RE_TAG_DELIMITER = / +/g;

const PostTags = (props) => {
	const { post } = props;


	return (
		<Card className={styles.tags}>
			<TagsList
				header='Artists'
				tags={post.tag_string_artist}
				category={TAG_CATEGORY_ARTIST}
			/>
			<TagsList
				header='Copyrights'
				tags={post.tag_string_copyright}
				category={TAG_CATEGORY_COPYRIGHT}
			/>
			<TagsList
				header='Characters'
				tags={post.tag_string_character}
				category={TAG_CATEGORY_CHARACTER}
			/>
			<TagsList
				header='General'
				tags={post.tag_string_general}
				category={TAG_CATEGORY_GENERAL}
			/>
			<TagsList
				header='Meta'
				tags={post.tag_string_meta}
				category={TAG_CATEGORY_META}
			/>
		</Card>
	);
};

const TagsList = (props) => {
	const { tags, header, category } = props;

	const list = tags
		? tags.split(RE_TAG_DELIMITER)
		: false


	if (!list) {
		return null;
	}

	return (
		<div>
			<h3>{header}</h3>
			<ul>
				{list.map((tag) => (
					<Tag
						key={tag}
						as='li'
						name={tag}
						category={category}
						resource={createTagResource(tag)}
					/>
				))}
			</ul>
		</div>
	);
};

// <PostDetails />
const RE_EXT_IMAGE = /\.(png|jpe?g|gif|webp)$/i;
const RE_EXT_VIDEO = /\.(mp4|webm)$/i;
const RE_EXT = /(?<=\.)[a-z0-9.]+$/i;

const PostDetails = (props) => {
	const { post } = props;

	const originalWidth = post.image_width;
	const originalHeight = post.image_height;
	const [width, height] = GET_IMAGE_CEIL(originalWidth, originalHeight, POST_IMAGE_LARGE_SIZE);

	const auth = useStore(AuthStore);

	const large_file_url = post.large_file_url;


	return (
		<>
			<Card className={styles.post}>
				<div key={large_file_url} className={styles.container}>
					{RE_EXT_IMAGE.test(large_file_url) ? (
						<img
							className={styles.media}
							width={width}
							height={height}
							src={large_file_url}
						/>
					) : RE_EXT_VIDEO.test(large_file_url) ? (
						<video
							className={styles.media}
							controls
							width={width}
							height={height}
							src={large_file_url}
						/>
					) : (
						<div className={styles.unsupported}>
							Post has unsupported file format: {RE_EXT.exec(large_file_url)?.[0] || '<missing file extension>'}
						</div>
					)}
				</div>

				<div className={styles.actions}>
					<Button as='a' download href={post.file_url} title='Download' variant='ghost'>
						<Icon src={DownloadIcon} />
					</Button>

					{auth.status === STATUS_LOGGED_IN && (
						<Favorite postId={post.id} />
					)}
				</div>
			</Card>

			{post.parent_id && (
				<Suspense fallback={null}>
					<PostsRelationship
						parent={post.parent_id}
						id={post.id}
						className={styles.relationship}
					/>
				</Suspense>
			)}

			{post.has_active_children && (
				<Suspense fallback={null}>
					<PostsRelationship
						parent={post.id}
						className={styles.relationship}
					/>
				</Suspense>
			)}
		</>
	);
};

const Favorite = (props) => {
	const { postId } = props;

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

	const loading = status === 'loading';
	const favorited = data?.favorited;

	const handleClick = () => {
		mutation.mutate({ post_id: postId, favorited: !favorited });
	};


	return (
		<Button
			title={favorited ? 'Unfavorite' : 'Favorite'}
			variant='ghost'
			disabled={loading}
			onClick={handleClick}
			className={clsx(favorited && styles.favorited)}
		>
			<Icon src={HeartIcon} />
		</Button>
	);
};
