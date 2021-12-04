import { h, Fragment } from 'preact';
import { Suspense, SuspenseList } from 'preact/compat';
import { useParams, Navigate } from 'react-router-dom';
import { createResource } from '~/lib/use-asset';

import { SideView, Main, Aside } from '~/layouts/SideView';
import { Card } from '~/components/Card';
import { CircularProgress } from '~/components/CircularProgress';
import { PostsRelationship } from '~/components/PostsRelationship';
import { Tag } from '~/components/Tag';
import * as styles from './PostDetails.css';

import * as asset from '~/api/assets.js';
import { POST_IMAGE_LARGE_SIZE, GET_IMAGE_CEIL } from '~/api/enums.js';


export default function PostDetailsPage () {
	const { id } = useParams();

	const idNum = parseInt(id);
	const post = asset.posts.use(idNum);


	if (Number.isNaN(idNum) || Math.sign(idNum) !== 1) {
		return <Navigate to='/' replace />
	}

	return (
		<SideView>
			<Main className={styles.main}>
				<Suspense fallback={<PostDetailsFallback />}>
					<PostDetails resource={post} />
				</Suspense>
			</Main>

			<Aside>
				<PostTags resource={post} />
			</Aside>
		</SideView>
	);
}

// <PostTags />
const RE_TAG_DELIMITER = / +/g;

function PostTags (props) {
	const { resource } = props;

	const data = resource.read();

	const artists = data.tag_string_artist
		? data.tag_string_artist.split(RE_TAG_DELIMITER)
		: false;

	const copyrights = data.tag_string_copyright
		? data.tag_string_copyright.split(RE_TAG_DELIMITER)
		: false;

	const characters = data.tag_string_character
		? data.tag_string_character.split(RE_TAG_DELIMITER)
		: false;

	const general = data.tag_string_general
		? data.tag_string_general.split(RE_TAG_DELIMITER)
		: false;

	const meta = data.tag_string_meta
		? data.tag_string_meta.split(RE_TAG_DELIMITER)
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
						resource={createResource(() => asset.tags.read(tag))}
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
	const { resource } = props;

	const data = resource.read();

	const originalWidth = data.image_width;
	const originalHeight = data.image_height;
	const [width, height] = GET_IMAGE_CEIL(originalWidth, originalHeight, POST_IMAGE_LARGE_SIZE);


	return (
		<>
			<Card className={styles.post}>
				<div key={data.large_file_url} className={styles.container}>
					{RE_EXT_IMAGE.test(data.large_file_url) ? (
						<img
							className={styles.media}
							width={width}
							height={height}
							src={data.large_file_url}
						/>
					) : RE_EXT_VIDEO.test(data.large_file_url) ? (
						<video
							className={styles.media}
							controls
							width={width}
							height={height}
							src={data.large_file_url}
						/>
					) : (
						<div className={styles.unsupported}>
							Post has unsupported file format
						</div>
					)}
				</div>
			</Card>

			{data.parent_id && (
				<Suspense fallback={null}>
					<PostsRelationship
						parent={data.parent_id}
						id={data.id}
						className={styles.relationship}
					/>
				</Suspense>
			)}

			{data.has_active_children && (
				<Suspense fallback={null}>
					<PostsRelationship
						parent={data.id}
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
