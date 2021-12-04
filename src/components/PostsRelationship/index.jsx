// Ha, ha, call me when there are more than 18 siblings in a relationship

import { h } from 'preact';
import { createMappedResource } from '~/lib/use-asset';

import clsx from 'clsx';
import { Link } from '~/components/Link';
import { Post } from '~/components/Post';
import { Card } from '~/components/Card';
import * as styles from './PostsRelationship.css';

import * as asset from '~/api/assets.js';

import { qss } from '~/utils/qss.js';


export function PostsRelationship (props) {
	const { parent, id = parent, className } = props;

	const tags = `parent:${parent}`;
	const count = asset.postCount.read(tags);
	const posts = asset.postList.use({ tags, page: 1, limit: 20 });

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
			<PostsRelationshipList
				resource={posts}
				current={id}
				search={search}
			/>
		</Card>
	);
}

export function PostsRelationshipList (props) {
	const { resource, current, search } = props;

	const posts = resource.read();


	return (
		<div className={styles.list}>
			{posts.map((item) => (
				<div
					className={clsx(styles.item, {
						[styles.isCurrent]: item.id === current,
					})}
				>
					<Post
						key={item.created_at}
						resource={createMappedResource(item)}
						search={search}
					/>
				</div>
			))}
		</div>
	);
}
