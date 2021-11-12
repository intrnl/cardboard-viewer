import { h } from 'preact';
import { Suspense } from 'preact/compat';
import { createMappedResource } from '~/lib/use-asset';
import { useStore } from '~/lib/global-store';

import * as styles from '~/src/styles/pages/PostsListing.module.css';
import { Post } from '~/src/components/Post.jsx';
import { Pagination } from '~/src/components/Pagination.jsx';

import { AuthStore } from '~/src/globals/auth.js';
import * as asset from '~/src/api/assets.js';
import { GET_MAX_PAGE } from '~/src/api/enums.js';

import { useSearchParams } from '~/src/utils/useSearchParams.js';
import { useFactoryMemo } from '~/src/utils/useFactoryMemo.js';


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

	const handlePageChange = (page) => {
		setParams({ page });
	};


	return (
		<div class={styles.container}>
			<Suspense fallback={<PostsListingFallback />}>
				<PostsListing resource={posts} />
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
	);
}

function normalizeTags (tags) {
	return tags.trim().split(/ +/).sort((a, b) => a.localeCompare(b)).join(' ');
}


function PostsListing (props) {
	const { resource } = props;

	const data = resource.read();


	return (
		<div className={styles.postListing}>
			{data.map((item) => (
				<Post
					key={item.created_at}
					resource={createMappedResource(item)}
					className={styles.postItem}
				/>
			))}
		</div>
	);
}

function PostsListingFallback () {
	return <div></div>
}

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
	return <div></div>
}
