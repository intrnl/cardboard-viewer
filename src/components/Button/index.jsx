import { h } from '@intrnl/freak';

import clsx from 'clsx';
import * as controls from '~/styles/misc/controls.css';
import * as styles from './Button.css';


export const Button = (props) => {
	const {
		as = 'button',
		variant = 'default',
		position,
		className,
		...rest
	} = props;

	const cn = clsx(styles.button, {
		[styles.isPrimary]: variant === 'primary',
		[styles.isDefault]: variant === 'default',
		[styles.isGhost]: variant === 'ghost',
		[controls.isStart]: position === 'start',
		[controls.isMiddle]: position === 'middle',
		[controls.isEnd]: position === 'end',
	}, className);


	return h(as, { className: cn, ...rest });
};
