import { h } from 'preact';
import { Suspense } from 'preact/compat';
import { useMemo, useState } from 'preact/hooks';
import { useQuery } from '@intrnl/rq';
import { useStore } from '~/lib/global-store';

import { useNavigate } from '~/components/Router';
import { SideView, Main, Aside } from '~/layouts/SideView';
import { Post, PostFallback } from '~/components/Post';
import { Pagination } from '~/components/Pagination';
import { Tag } from '~/components/Tag';
import { CircularProgress } from '~/components/CircularProgress';
import * as styles from './PostsListing.css';

import { AuthStore } from '~/globals/auth';
import { getPostList, getPostCount, getPopularTags, getRelatedTags } from '~/api/assets';
import { createTagResource } from '~/api/resource';
import { GET_MAX_PAGE } from '~/api/enums';

import { createMappedResource } from '~/utils/resource';
import { useSearchParams } from '~/utils/useSearchParams';
import { useFactoryMemo } from '~/utils/useFactoryMemo';
import { qss } from '~/utils/qss';


const DEFAULT_SEARCH_PARAMS = {
	tags: '',
	page: '1',
	limit: '20',
};

const PostsListingPage = () => {
	const { tags: query, page, limit } = useSearchParams(DEFAULT_SEARCH_PARAMS);
	const navigate = useNavigate();

	const auth = useStore(AuthStore);
	const RE_ORDFAV = auth.profile && (auth.profile._re_ordfav ||= new RegExp(`\\b(?:ord)?fav:${auth.profile.name}\\b`));
	const maxPage = GET_MAX_PAGE(auth.profile?.level);

	const tags = useFactoryMemo(normalizeTags, [query]);
	const pageNum = parseInt(page);
	const limitNum = parseInt(limit);

	const isInFavorite = useMemo(() => RE_ORDFAV?.test(tags), [tags]);

	const search = query ? qss({ tags: query }) : false;

	const handlePageChange = (page) => {
		navigate('/posts?' + qss({ tags: query, page, limit }));
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
				<PostsPagination
					tags={tags}
					page={pageNum}
					maxPage={maxPage}
					limit={limitNum}
					onChangePage={handlePageChange}
				/>
			</Main>

			<Aside>
				<Suspense fallback={<CircularProgress />}>
					<TagsList tags={tags} />
				</Suspense>
			</Aside>
		</SideView>
	);
};

export default PostsListingPage;


const normalizeTags = (tags) => {
	return tags.trim().split(/ +/).sort((a, b) => a.localeCompare(b)).join(' ');
};

// <TagsList />
const TagsList = (props) => {
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


	if (data.length < 1) {
		return null;
	}

	return (
		<div>
			<h3>Tags</h3>
			<ul>
				{data.slice(0, 20).map(([tag]) => (
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
};

// <PostsListing />
const RE_ALLOW_DELETED = /\bstatus:(all|any|active|unmoderated|modqueue|deleted|appealed)\b/;

const PostsListing = (props) => {
	const { tags, page, limit, search, isInFavorite } = props;

	const { status, data } = useQuery({
		key: ['post/list', { tags, page, limit }],
		fetch: getPostList,
		staleTime: 60000,
	});

	const showDeleted = useMemo(() => RE_ALLOW_DELETED.test(tags), [tags]);


	if (status === 'loading') {
		return (
			<PostsListingFallback size={limit} />
		)
	}

	return (
		<div className={styles.listing}>
			{data.length > 0 ? (
				data.map((item) => {
					if (!item.id || (!showDeleted && item.is_deleted)) {
						return null;
					}

					return (
						<Post
							key={item.preview_file_url}
							resource={createMappedResource(item)}
							className={styles.item}
							search={search}
							isInFavorite={isInFavorite}
						/>
					)
				})
			) : (
				<p>Nothing to see here.</p>
			)}
		</div>
	);
};

const PostsListingFallback = (props) => {
	const { size } = props;


	return (
		<div className={styles.listing}>
			{Array.from({ length: size }, () => (
				<PostFallback className={styles.item} />
			))}
		</div>
	);
};

// <PostsPagination />
const PostsPagination = (props) => {
	const { tags, page, maxPage, limit, onChangePage } = props

	const { status, data } = useQuery({
		key: ['post/count', tags],
		fetch: getPostCount,
		staleTime: 60000,
	});


	if (status === 'loading' || !data) {
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
};
