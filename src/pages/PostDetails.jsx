import { h, Fragment } from 'preact';
import { Suspense, SuspenseList } from 'preact/compat';
import { useParams, Navigate } from 'react-router-dom';
import { createResource } from '~/lib/use-asset';

import * as styles from '~/src/styles/pages/PostDetails.module.css';
import { MainLayout } from '~/src/layouts/MainLayout.jsx';
import { PostsRelationship } from '~/src/components/PostsRelationship.jsx';
import { Tag } from '~/src/components/Tag.jsx';

import * as asset from '~/src/api/assets.js';
import { POST_IMAGE_LARGE_SIZE, GET_IMAGE_CEIL } from '~/src/api/enums.js';


export default function PostDetailsPage () {
	const { id } = useParams();

	const idNum = parseInt(id);
	const post = asset.posts.get(idNum);


	if (Number.isNaN(idNum) || Math.sign(idNum) !== 1) {
		return <Navigate to='/' replace />
	}

	return (
		<MainLayout aside={<PostDetailsAside resource={post} />}>
			<Suspense fallback={<PostDetailsFallback />}>
				<PostDetails resource={post} />
			</Suspense>
		</MainLayout>
	);
}

// <PostDetailsAside />
const RE_TAG_DELIMITER = / +/g;

function PostDetailsAside (props) {
	const { resource } = props;


	return (
		<>
			<Suspense fallback={null}>
				<PostTags resource={resource} />
			</Suspense>
		</>
	);
}

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
		<SuspenseList>
			{artists && (
				<Suspense fallback={null}>
					<TagsList
						header='Artists'
						tags={artists}
					/>
				</Suspense>
			)}
			{copyrights && (
				<Suspense fallback={null}>
					<TagsList
						header='Copyrights'
						tags={copyrights}
					/>
				</Suspense>
			)}
			{characters && (
				<Suspense fallback={null}>
					<TagsList
						header='Characters'
						tags={characters}
					/>
				</Suspense>
			)}
			{general && (
				<Suspense fallback={null}>
					<TagsList
						header='General'
						tags={general}
					/>
				</Suspense>
			)}
			{meta && (
				<Suspense fallback={null}>
					<TagsList
						header='Meta'
						tags={meta}
					/>
				</Suspense>
			)}
		</SuspenseList>
	);
}

function TagsList (props) {
	const { tags, header } = props;

	return (
		<div className={styles.tagContainer}>
			<h3 className={styles.tagHeader}>
				{header}
			</h3>
			<ul className={styles.tagListing}>
				{tags.map((tag) => (
					<Tag
						key={tag}
						component='li'
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
	const [width, height, ratio] = GET_IMAGE_CEIL(originalWidth, originalHeight, POST_IMAGE_LARGE_SIZE);


	return (
		<div className={styles.container}>
			{data.parent_id && (
				<Suspense fallback={<div>Fetching child to parent relationship</div>}>
					<PostsRelationship parent={data.parent_id}  id={data.id} />
				</Suspense>
			)}

			{data.has_active_children && (
				<Suspense fallback={<div>Fetching parent to child relationship</div>}>
					<PostsRelationship parent={data.id} />
				</Suspense>
			)}

			{ratio < 1 && (
				<div>Resized to {convertToPercentage(ratio)} of original</div>
			)}

			<div key={data.large_file_url}>
				{RE_EXT_IMAGE.test(data.large_file_url) ? (
					<img
						className={styles.postMedia}
						width={width}
						height={height}
						src={data.large_file_url}
					/>
				) : RE_EXT_VIDEO.test(data.large_file_url) ? (
					<video
						className={styles.postMedia}
						controls
						width={width}
						height={height}
						src={data.large_file_url}
					/>
				) : (
					<div>Post has unsupported file format</div>
				)}
			</div>
		</div>
	);
}


function PostDetailsFallback () {
	return (
		<div>Loading post</div>
	);
}


function convertToPercentage (number) {
	return number.toLocaleString(undefined, {
		style: 'percent',
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	});
}


