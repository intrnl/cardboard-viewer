import { h } from 'preact';
import { forwardRef } from 'preact/compat';

import clsx from 'clsx';
import * as styles from './MenuItem.css';


// <MenuItem />
const MenuItemRef = forwardRef(MenuItem);

function MenuItem (props, ref) {
	const {
		as = 'button',
		className,
		...rest
	} = props;

	const cn = clsx(styles.item, className);


	return h(as, { ref, className: cn, ...rest });
}

export { MenuItemRef as MenuItem };
