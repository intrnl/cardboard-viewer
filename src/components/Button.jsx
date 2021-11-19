import { h } from 'preact';

import clsx from 'clsx';
import * as styles from '~/src/styles/components/Button.module.css';


export function Button (props) {
	const {
		as = 'button',
		variant = 'secondary',
		className,
		...rest
	} = props;

	const cn = clsx(styles.button, className, {
		[styles.isPrimary]: variant === 'primary',
		[styles.isSecondary]: variant === 'secondary',
		[styles.isGhost]: variant === 'ghost',
	});


	return h(as, { className: cn, ...rest });
}
