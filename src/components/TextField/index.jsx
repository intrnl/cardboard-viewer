import { h } from 'preact';
import { forwardRef } from 'preact/compat';

import clsx from 'clsx';
import controls from '~/styles/misc/controls.module.css';
import styles from './TextField.module.css';


const TextFieldRef = forwardRef(TextField);

function TextField (props, ref) {
	const {
		as = 'input',
		fullWidth,
		position,
		className,
		...rest
	} = props;

	const cn = clsx(styles.field, {
		[styles.isFullwidth]: fullWidth,
		[controls.isStart]: position === 'start',
		[controls.isMiddle]: position === 'middle',
		[controls.isEnd]: position === 'end',
	}, className);


	return h(as, { ref, className: cn, ...rest });
}

export { TextFieldRef as TextField };
