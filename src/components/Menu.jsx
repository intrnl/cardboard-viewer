import { h } from 'preact';
import { forwardRef } from 'preact/compat';
import clsx from 'clsx';

import { Button } from '~/src/components/Button.jsx';

import * as styles from '~/src/styles/components/Menu.module.css';


// <Menu />
const MenuRef = forwardRef(Menu);

function Menu (props, ref) {
	const {
		as = 'div',
		className,
		...rest
	} = props;

	const cn = clsx(styles.menu, className);


	return h(as, { ref, className: cn, ...rest });
}

export { MenuRef as Menu };

// <MenuItem />
const MenuItemRef = forwardRef(MenuItem);

function MenuItem (props, ref) {
	const {
		className,
		...rest
	} = props;

	const cn = clsx(styles.menuItem, className);


	return h(Button, { ref, className: cn, variant: 'ghost', ...rest });
}

export { MenuItemRef as MenuItem };
