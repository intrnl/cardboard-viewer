import { h, Fragment } from 'preact';
import { Suspense } from 'preact/compat';
import { createMappedResource, createResource } from '~/lib/use-asset';
import { useStore } from '~/lib/global-store';

import * as styles from '~/src/styles/pages/PostsListing.module.css';
import { MainLayout } from '~/src/layouts/MainLayout.jsx';
import { Post, PostFallback } from '~/src/components/Post.jsx';
import { Pagination } from '~/src/components/Pagination.jsx';
import { Tag } from '~/src/components/Tag.jsx';

import { AuthStore } from '~/src/globals/auth.js';
import * as asset from '~/src/api/assets.js';
import { GET_MAX_PAGE } from '~/src/api/enums.js';

import { useSearchParams } from '~/src/utils/useSearchParams.js';
import { useFactoryMemo } from '~/src/utils/useFactoryMemo.js';
import { qss } from '~/src/utils/qss.js';


const DEFAULT_SEARCH_PARAMS = {
	query: '',
	page: '1',
	limit: '20',
};

export default function PostsListingPage () {
	const [{ query, page, limit }, setParams] = useSearchParams(DEFAULT_SEARCH_PARAMS);

	const tags = useFactoryMemo(normalizeTags, [query]);
	const pageNum = parseInt(page);
	const limitNum = parseInt(limit);

	const posts = asset.postList.get({ tags, page: pageNum, limit: limitNum });
	const count = asset.postCount.get(tags);

	const search = qss({ query });

	const handlePageChange = (page) => {
		setParams({ page });
	};


	return (
		<MainLayout aside={<PostsListingAside tags={tags} />}>
			<div class={styles.container}>
				<Suspense fallback={<PostsListingFallback size={limit} />}>
					<PostsListing
						resource={posts}
						search={search}
					/>
				</Suspense>
				<Suspense fallback={<PostsPaginationFallback />}>
					<PostsPagination
						resource={count}
						page={pageNum}
						limit={limitNum}
						onChangePage={handlePageChange}
					/>
				</Suspense>
			</div>
		</MainLayout>
	);
}

function normalizeTags (tags) {
	return tags.trim().split(/ +/).sort((a, b) => a.localeCompare(b)).join(' ');
}

// <PostsListingAside />
function PostsListingAside (props) {
	const { tags } = props;

	const list = tags ? asset.relatedTags.get(tags) : asset.popularTags.get();

	return (
		<>
			<Suspense fallback={null}>
				<TagsList resource={list} />
			</Suspense>
		</>
	);
}

function TagsList (props) {
	const { resource } = props;

	const data = resource.read();

	return (
		<div className={styles.tagContainer}>
			<h3 className={styles.tagHeader}>
				Tags
			</h3>
			<ul className={styles.tagListing}>
				{data.slice(0, 20).map(([tag]) => (
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

// <PostsListing />
function PostsListing (props) {
	const { resource, search } = props;

	const data = resource.read();


	return (
		<div className={styles.postListing}>
			{data.map((item) => (
				<Post
					key={item.created_at}
					resource={createMappedResource(item)}
					className={styles.postItem}
					search={search}
				/>
			))}
		</div>
	);
}

function PostsListingFallback (props) {
	const { size } = props;


	return (
		<div className={styles.postListing}>
			{Array.from({ length: size }, () => (
				<PostFallback className={styles.postItem} />
			))}
		</div>
	);
}

// <PostsPagination />
function PostsPagination (props) {
	const { resource, page, limit, onChangePage } = props

	const auth = useStore(AuthStore);
	const count = resource.read();

	const currentPage = page;
	const totalPage = Math.max(Math.min(Math.floor(count / limit), GET_MAX_PAGE(auth.profile?.level)), 1);


	return (
		<Pagination
			page={currentPage}
			total={totalPage}
			onChangePage={onChangePage}
		/>
	);
}

function PostsPaginationFallback () {
	// I don't think we have an actual need to show placeholders for this.
	return null;
}
