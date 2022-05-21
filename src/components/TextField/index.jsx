import { h } from '@intrnl/freak';

import clsx from 'clsx';
import * as controls from '~/styles/misc/controls.css';
import * as styles from './TextField.css';


export const TextField = (props) => {
	const {
		as = 'input',
		fullWidth,
		position,
		className,
		...rest
	} = props;

	const cn = clsx(styles.field, {
		[styles.isFullWidth]: fullWidth,
		[controls.isStart]: position === 'start',
		[controls.isMiddle]: position === 'middle',
		[controls.isEnd]: position === 'end',
	}, className);


	return h(as, { className: cn, ...rest });
};
