import { h } from 'preact';
import { Suspense } from 'preact/compat';
import { useMemo, useState } from 'preact/hooks';
import { useQuery } from '@intrnl/rq';
import { useStore } from '~/lib/global-store';

import { SideView, Main, Aside } from '~/layouts/SideView';
import { Post, PostFallback } from '~/components/Post';
import { Pagination } from '~/components/Pagination';
import { Tag } from '~/components/Tag';
import { CircularProgress } from '~/components/CircularProgress';
import * as styles from './PostsListing.css';

import { AuthStore } from '~/globals/auth.js';
import { getPostList, getPostCount, getPopularTags, getRelatedTags } from '~/api/assets.new';
import { createTagResource } from '~/api/resource';
import { GET_MAX_PAGE } from '~/api/enums.js';

import { createMappedResource } from '~/utils/resource';
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

	const auth = useStore(AuthStore);
	const RE_ORDFAV = auth.profile && (auth.profile._re_ordfav ||= new RegExp(`\\b(?:ord)?fav:${auth.profile.name}\\b`));
	const maxPage = GET_MAX_PAGE(auth.profile?.level);

	const tags = useFactoryMemo(normalizeTags, [query]);
	const pageNum = parseInt(page);
	const limitNum = parseInt(limit);

	const isOrderRandom = useMemo(() => RE_ORDER_RANDOM.test(tags), [tags]);
	const isInFavorite = useMemo(() => RE_ORDFAV?.test(tags), [tags]);

	const search = query ? qss({ query }) : false;

	const handlePageChange = (page) => {
		setParams({ page });
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};


	return (
		<SideView flow className={styles.container}>
			<Main className={styles.main}>
				<PostsListing
					tags={tags}
					page={pageNum}
					limit={limitNum}
					search={search}
					isInFavorite={isInFavorite}
				/>
				{!isOrderRandom && (
					<PostsPagination
						tags={tags}
						page={pageNum}
						maxPage={maxPage}
						limit={limitNum}
						onChangePage={handlePageChange}
					/>
				)}
			</Main>

			<Aside>
				<Suspense fallback={<CircularProgress />}>
					<TagsList tags={tags} />
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
	const { tags } = props;

	const [prevDate] = useState(() => {
		const date = new Date();
		date.setDate(date.getDate() - 1);

		return date.toISOString().split('T')[0];
	});

	const { data } = useQuery({
		key: tags ? ['tag/related', tags] : ['tag/popular', prevDate],
		fetch: tags ? getRelatedTags : getPopularTags,
		staleTime: 60000,
		suspense: true,
	});

	return (
		<div>
			<h3>Tags</h3>
			<ul>
				{data.slice(0, 20).map(([tag]) => (
					<Tag
						key={tag}
						as='li'
						resource={createTagResource(tag)}
					/>
				))}
			</ul>
		</div>
	);
}

// <PostsListing />
function PostsListing (props) {
	const { tags, page, limit, search, isInFavorite } = props;

	const { status, data } = useQuery({
		key: ['post/list', { tags, page, limit }],
		fetch: getPostList,
		staleTime: 60000,
	})

	if (status === 'loading') {
		return (
			<PostsListingFallback size={limit} />
		)
	}

	return (
		<div className={styles.listing}>
			{data.map((item) => (
				<Post
					key={item.created_at}
					resource={createMappedResource(item)}
					className={styles.item}
					search={search}
					isInFavorite={isInFavorite}
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
	const { tags, page, maxPage, limit, onChangePage } = props

	const { status, data } = useQuery({
		key: ['post/count', tags],
		fetch: getPostCount,
		staleTime: 60000,
	});

	if (status === 'loading') {
		// Don't think we need to show placeholders for this.
		return null;
	}

	const currentPage = page;
	const totalPage = Math.max(Math.min(Math.ceil(data / limit), maxPage), 1);

	return (
		<Pagination
			page={currentPage}
			total={totalPage}
			onChangePage={onChangePage}
		/>
	);
}
