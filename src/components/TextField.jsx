import { h } from 'preact';
import { forwardRef } from 'preact/compat';

import clsx from 'clsx';
import * as styles from '~/src/styles/components/TextField.module.css';


const TextFieldRef = forwardRef(TextField);

function TextField (props, ref) {
	const {
		as = 'input',
		className,
		...rest
	} = props;

	const cn = clsx(styles.field, className);


	return h(as, { ref, className: cn, ...rest });
}

export { TextFieldRef as TextField };
