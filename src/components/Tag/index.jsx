import { h } from '@intrnl/freak';

import clsx from 'clsx';
import { Link } from '~/components/Link';
import * as styles from './Tag.css';

import {
	TAG_CATEGORY_GENERAL,
	TAG_CATEGORY_ARTIST,
	TAG_CATEGORY_COPYRIGHT,
	TAG_CATEGORY_CHARACTER,
	TAG_CATEGORY_META,
} from '~/api/enums';

import { qss } from '~/utils/qss';


const countFormatter = new Intl.NumberFormat(undefined, {
	notation: 'compact',
});

export const Tag = (props) => {
	const { as = 'span', name, category, resource, className } = props;

	const Component = as;

	const data = resource.read();

	const tag = data?.name ?? name;
	const cat = data?.category ?? category;
	const count = data?.post_count ?? -1;

	return (
		<Component
			className={clsx(styles.tag, className, {
				[styles.isGeneral]: cat === TAG_CATEGORY_GENERAL,
				[styles.isArtist]: cat === TAG_CATEGORY_ARTIST,
				[styles.isCopyright]: cat === TAG_CATEGORY_COPYRIGHT,
				[styles.isCharacter]: cat === TAG_CATEGORY_CHARACTER,
				[styles.isMeta]: cat === TAG_CATEGORY_META,
			})}
		>
			<Link to={'/posts?' + qss({ tags: tag + ' ' })} className={styles.link}>
				{tag}
			</Link>
			{count > 0 && (
				<span className={styles.count}>
					{countFormatter.format(data.post_count)}
				</span>
			)}
		</Component>
	);
};
