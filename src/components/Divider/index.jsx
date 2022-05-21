import { h } from '@intrnl/freak';
import clsx from 'clsx';

import * as styles from './Divider.css';


export const Divider = (props) => {
	const { orientation, gap } = props;

	const cn = clsx(styles.divider, {
		[styles.isVertical]: orientation === 'vertical',
		[styles.isHorizontal]: orientation === 'horizontal',
		[styles.isGap]: gap,
	});


	return (
		<div className={cn} />
	);
};
