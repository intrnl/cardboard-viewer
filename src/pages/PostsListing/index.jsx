import { h } from 'preact';
import { Suspense } from 'preact/compat';
import { useMemo } from 'preact/hooks';
import { createMappedResource, createResource } from '~/lib/use-asset';
import { useStore } from '~/lib/global-store';

import { SideView, Main, Aside } from '~/layouts/SideView';
import { Post, PostFallback } from '~/components/Post';
import { Pagination } from '~/components/Pagination';
import { Tag } from '~/components/Tag';
import { CircularProgress } from '~/components/CircularProgress';
import * as styles from './PostsListing.css';

import { AuthStore } from '~/globals/auth.js';
import * as asset from '~/api/assets.js';
import { GET_MAX_PAGE } from '~/api/enums.js';

import { useSearchParams } from '~/utils/useSearchParams.js';
import { useFactoryMemo } from '~/utils/useFactoryMemo.js';
import { qss } from '~/utils/qss.js';


const DEFAULT_SEARCH_PARAMS = {
	query: '',
	page: '1',
	limit: '20',
};

const RE_ORDER_RANDOM = /\border:random\b/i;

export default function PostsListingPage () {
	const [{ query, page, limit }, setParams] = useSearchParams(DEFAULT_SEARCH_PARAMS);

	const tags = useFactoryMemo(normalizeTags, [query]);
	const pageNum = parseInt(page);
	const limitNum = parseInt(limit);

	const isOrderRandom = useMemo(() => RE_ORDER_RANDOM.test(tags), [tags]);
	const posts = asset.postList.use({ tags, page: pageNum, limit: limitNum });
	const count = asset.postCount.use(tags);
	const tagsList = tags ? asset.relatedTags.use(tags) : asset.popularTags.use();

	const search = query ? qss({ query }) : false;

	const handlePageChange = (page) => {
		setParams({ page });
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};


	return (
		<SideView flow className={styles.container}>
			<Main className={styles.main}>
				<Suspense fallback={<PostsListingFallback size={limit} />}>
					<PostsListing
						resource={posts}
						search={search}
					/>
				</Suspense>
				{!isOrderRandom && (
					<Suspense fallback={<PostsPaginationFallback />}>
						<PostsPagination
							resource={count}
							page={pageNum}
							limit={limitNum}
							onChangePage={handlePageChange}
						/>
					</Suspense>
				)}
			</Main>

			<Aside>
				<Suspense fallback={<CircularProgress />}>
					<TagsList resource={tagsList} />
				</Suspense>
			</Aside>
		</SideView>
	);
}

function normalizeTags (tags) {
	return tags.trim().split(/ +/).sort((a, b) => a.localeCompare(b)).join(' ');
}

// <TagsList />
function TagsList (props) {
	const { resource } = props;

	const data = resource.read();

	return (
		<div>
			<h3>Tags</h3>
			<ul>
				{data.slice(0, 20).map(([tag]) => (
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

// <PostsListing />
function PostsListing (props) {
	const { resource, search } = props;

	const data = resource.read();


	return (
		<div className={styles.listing}>
			{data.map((item) => (
				<Post
					key={item.created_at}
					resource={createMappedResource(item)}
					className={styles.item}
					search={search}
				/>
			))}
		</div>
	);
}

function PostsListingFallback (props) {
	const { size } = props;


	return (
		<div className={styles.listing}>
			{Array.from({ length: size }, () => (
				<PostFallback className={styles.item} />
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
	const totalPage = Math.max(Math.min(Math.ceil(count / limit), GET_MAX_PAGE(auth.profile?.level)), 1);


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
