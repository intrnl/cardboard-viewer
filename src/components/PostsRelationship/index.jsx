import { h } from 'preact';
import { useQuery } from '@intrnl/rq';

import clsx from 'clsx';
import { Link } from '~/components/Link';
import { Post } from '~/components/Post';
import { Card } from '~/components/Card';
import * as styles from './PostsRelationship.css';

import { getPostList, getPostCount } from '~/api/assets';

import { createMappedResource } from '~/utils/resource';
import { qss } from '~/utils/qss';


export function PostsRelationship (props) {
	const { parent, id = parent, className } = props;

	const tags = `parent:${parent}`;

	const { data: posts } = useQuery({
		key: ['post/list', { tags, page: 1, limit: 20 }],
		fetch: getPostList,
		suspense: true,
		staleTime: 60000,
	});

	const { data: count } = useQuery({
		key: ['post/count', tags],
		fetch: getPostCount,
		suspense: true,
		staleTime: 60000,
	});

	const search = qss({ query: tags + ' ' });
	const toSearch = `/?${search}`;


	return (
		<Card className={clsx(styles.relationship, className)}>
			{id !== parent ? (
				<span>
					This post belongs to a {' '}
					<Link to={toSearch}>parent</Link>
					{count > 2 && ` and has ${count - 2} siblings`}
				</span>
			) : (
				<span>
					This post has {' '}
					<Link to={toSearch}>{count - 1} children</Link>
				</span>
			)}
			<div className={styles.list}>
				{posts.map((item) => (
					<div className={clsx(styles.item, item.id === id && styles.isCurrent)}>
						<Post
							key={item.created_at}
							resource={createMappedResource(item)}
							search={search}
						/>
					</div>
				))}
			</div>
		</Card>
	);
}
