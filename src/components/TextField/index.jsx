import { h } from 'preact';
import { forwardRef } from 'preact/compat';

import clsx from 'clsx';
import * as controls from '~/styles/misc/controls.css';
import * as styles from './TextField.css';


const TextField = (props, ref) => {
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


	return h(as, { ref, className: cn, ...rest });
};

const TextFieldRef = forwardRef(TextField);

export { TextFieldRef as TextField };
