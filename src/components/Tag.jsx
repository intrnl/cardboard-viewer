import { h } from 'preact';
import { Link } from 'react-router-dom';

import clsx from 'clsx';
import * as styles from '~/src/styles/components/Tag.module.css';

import {
	TAG_CATEGORY_GENERAL,
	TAG_CATEGORY_ARTIST,
	TAG_CATEGORY_COPYRIGHT,
	TAG_CATEGORY_CHARACTER,
	TAG_CATEGORY_META,
} from '../api/enums';
import { qss } from '../utils/qss';


const countFormatter = new Intl.NumberFormat(undefined, {
	notation: 'compact',
});

export function Tag (props) {
	const { resource, component = 'span', className } = props;

	const Component = component;

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
			<Link to={`/?${qss({ query: name + ' ' })}`}>{name}</Link>
			<span>{countFormatter.format(data.post_count)}</span>
		</Component>
	);
}
