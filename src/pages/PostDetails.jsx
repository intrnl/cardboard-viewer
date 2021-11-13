import { h } from 'preact';
import { Suspense } from 'preact/compat';
import { useParams, Navigate } from 'react-router-dom';

import * as styles from '~/src/styles/pages/PostDetails.module.css';
import MainLayout from '~/src/layouts/MainLayout.jsx';
import { PostsRelationship } from '~/src/components/PostsRelationship.jsx';

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
		<MainLayout>
			<Suspense fallback={<PostDetailsFallback />}>
				<PostDetails resource={post} />
			</Suspense>
		</MainLayout>
	);
}


const RE_EXT_IMAGE = /\.(png|jpe?g|webp)$/i;
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
