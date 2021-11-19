import { h } from 'preact';

import clsx from 'clsx';
import * as styles from '~/src/styles/components/TextField.module.css';


export function TextField (props) {
	const {
		as = 'input',
		className,
		...rest
	} = props;

	const cn = clsx(styles.field, className);


	return h(as, { className: cn, ...rest });
}
