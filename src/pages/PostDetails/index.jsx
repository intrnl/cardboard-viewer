import { h, Fragment } from 'preact';
import { Suspense, SuspenseList } from 'preact/compat';
import { useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@intrnl/rq';

import { SideView, Main, Aside } from '~/layouts/SideView';
import { Card } from '~/components/Card';
import { CircularProgress } from '~/components/CircularProgress';
import { PostsRelationship } from '~/components/PostsRelationship';
import { Tag } from '~/components/Tag';
import * as styles from './PostDetails.css';

import { getPost } from '~/api/assets';
import { createTagResource } from '~/api/resource';
import { POST_IMAGE_LARGE_SIZE, GET_IMAGE_CEIL } from '~/api/enums';


export default function PostDetailsPage () {
	const { id } = useParams();

	const idNum = parseInt(id);
	const invalid = Number.isNaN(idNum) || Math.sign(idNum) !== 1;

	const { data: post } = useQuery({
		disabled: invalid,
		key: ['post', idNum],
		fetch: getPost,
		staleTime: 60000,
		suspense: true,
	});


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
}

// <PostTags />
const RE_TAG_DELIMITER = / +/g;

function PostTags (props) {
	const { post } = props;

	const artists = post.tag_string_artist
		? post.tag_string_artist.split(RE_TAG_DELIMITER)
		: false;

	const copyrights = post.tag_string_copyright
		? post.tag_string_copyright.split(RE_TAG_DELIMITER)
		: false;

	const characters = post.tag_string_character
		? post.tag_string_character.split(RE_TAG_DELIMITER)
		: false;

	const general = post.tag_string_general
		? post.tag_string_general.split(RE_TAG_DELIMITER)
		: false;

	const meta = post.tag_string_meta
		? post.tag_string_meta.split(RE_TAG_DELIMITER)
		: false;


	return (
		<Card className={styles.tags}>
			<SuspenseList revealOrder='forwards' tail='collapsed'>
				{artists && (
					<Suspense fallback={<CircularProgress />}>
						<TagsList
							header='Artists'
							tags={artists}
						/>
					</Suspense>
				)}
				{copyrights && (
					<Suspense fallback={<CircularProgress />}>
						<TagsList
							header='Copyrights'
							tags={copyrights}
						/>
					</Suspense>
				)}
				{characters && (
					<Suspense fallback={<CircularProgress />}>
						<TagsList
							header='Characters'
							tags={characters}
						/>
					</Suspense>
				)}
				{general && (
					<Suspense fallback={<CircularProgress />}>
						<TagsList
							header='General'
							tags={general}
						/>
					</Suspense>
				)}
				{meta && (
					<Suspense fallback={<CircularProgress />}>
						<TagsList
							header='Meta'
							tags={meta}
						/>
					</Suspense>
				)}
			</SuspenseList>
		</Card>
	);
}

function TagsList (props) {
	const { tags, header } = props;


	return (
		<div>
			<h3>{header}</h3>
			<ul>
				{tags.map((tag) => (
					<Tag
						key={tag}
						as='li'
						name={tag}
						resource={createTagResource(tag)}
					/>
				))}
			</ul>
		</div>
	);
}

// <PostDetails />
const RE_EXT_IMAGE = /\.(png|jpe?g|gif|webp)$/i;
const RE_EXT_VIDEO = /\.(mp4|webm)$/i;

function PostDetails (props) {
	const { post } = props;

	const originalWidth = post.image_width;
	const originalHeight = post.image_height;
	const [width, height] = GET_IMAGE_CEIL(originalWidth, originalHeight, POST_IMAGE_LARGE_SIZE);


	return (
		<>
			<Card className={styles.post}>
				<div key={post.large_file_url} className={styles.container}>
					{RE_EXT_IMAGE.test(post.large_file_url) ? (
						<img
							className={styles.media}
							width={width}
							height={height}
							src={post.large_file_url}
						/>
					) : RE_EXT_VIDEO.test(post.large_file_url) ? (
						<video
							className={styles.media}
							controls
							width={width}
							height={height}
							src={post.large_file_url}
						/>
					) : (
						<div className={styles.unsupported}>
							Post has unsupported file format
						</div>
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
}


function PostDetailsFallback () {
	return (
		<Card>
			<CircularProgress />
		</Card>
	);
}
