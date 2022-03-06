import { h } from 'preact';
import clsx from 'clsx';

import styles from './Divider.module.css';


export function Divider (props) {
	const { orientation, gap } = props;

	const cn = clsx(styles.divider, {
		[styles.isVertical]: orientation === 'vertical',
		[styles.isHorizontal]: orientation === 'horizontal',
		[styles.isGap]: gap,
	});


	return h('div', { className: cn });
}
