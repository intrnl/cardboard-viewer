import { h } from 'preact';

import clsx from 'clsx';
import * as styles from '~/src/styles/components/Button.module.css';


export function Button (props) {
	const { className, variant = 'secondary', ...rest } = props;

	const cn = clsx(styles.button, className, {
		[styles.isPrimary]: variant === 'primary',
		[styles.isSecondary]: variant === 'secondary',
		[styles.isGhost]: variant === 'ghost',
	});


	return (
		<button className={cn} {...rest} />
	);
}
