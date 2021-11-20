import { h } from 'preact';
import clsx from 'clsx';

import * as styles from '~/src/styles/components/Divider.module.css';


export function Divider (props) {
	const { gap } = props;

	const cn = clsx(styles.divider, {
		[styles.isGap]: gap,
	});


	return h('div', { className: cn });
}
