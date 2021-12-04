import { h } from 'preact';

import clsx from 'clsx';
import { Link } from '~/components/Link';
import * as styles from './Tag.css';

import {
	TAG_CATEGORY_GENERAL,
	TAG_CATEGORY_ARTIST,
	TAG_CATEGORY_COPYRIGHT,
	TAG_CATEGORY_CHARACTER,
	TAG_CATEGORY_META,
} from '~/api/enums.js';

import { qss } from '~/utils/qss.js';


const countFormatter = new Intl.NumberFormat(undefined, {
	notation: 'compact',
});

export function Tag (props) {
	const { as = 'span', resource, className } = props;

	const Component = as;

	const data = resource.read();
	const name = data.name;
	const category = data.category;

	return (
		<Component
			className={clsx(styles.tag, className, {
				[styles.isGeneral]: category === TAG_CATEGORY_GENERAL,
				[styles.isArtist]: category === TAG_CATEGORY_ARTIST,
				[styles.isCopyright]: category === TAG_CATEGORY_COPYRIGHT,
				[styles.isCharacter]: category === TAG_CATEGORY_CHARACTER,
				[styles.isMeta]: category === TAG_CATEGORY_META,
			})}
		>
			<Link to={`/?${qss({ query: name + ' ' })}`} className={styles.link}>
				{name}
			</Link>
			<span className={styles.count}>
				{countFormatter.format(data.post_count)}
			</span>
		</Component>
	);
}
