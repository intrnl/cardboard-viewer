import { h } from 'preact';
import { forwardRef } from 'preact/compat';

import clsx from 'clsx';
import * as styles from '~/src/styles/components/Button.module.css';


const ButtonRef = forwardRef(Button);

function Button (props, ref) {
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


	return h(as, { ref, className: cn, ...rest });
}

export { ButtonRef as Button };
