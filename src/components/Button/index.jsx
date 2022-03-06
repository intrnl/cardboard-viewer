import { h } from 'preact';
import { forwardRef } from 'preact/compat';

import clsx from 'clsx';
import controls from '~/styles/misc/controls.module.css';
import styles from './Button.module.css';


const ButtonRef = forwardRef(Button);

function Button (props, ref) {
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


	return h(as, { ref, className: cn, ...rest });
}

export { ButtonRef as Button };
