import { h } from 'preact';

import clsx from 'clsx';
import * as styles from '~/src/styles/components/Divider.module.css';


export function Divider (props) {
	const {
		as = 'div',
		direction = 'vertical',
		className,
		...rest
	} = props;

	const cn = clsx(styles.divider, className, {
		[styles.isVertical]: direction === 'vertical',
		[styles.isHorizontal]: variant === 'horizontal',
	});


	return h(as, { ref, className: cn, ...rest });
}
