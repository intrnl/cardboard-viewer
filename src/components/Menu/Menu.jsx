import { h } from 'preact';
import { forwardRef } from 'preact/compat';

import clsx from 'clsx';
import { Button } from '~/components/Button';
import * as styles from './Menu.css';


// <Menu />
const Menu = (props, ref) => {
	const {
		as = 'div',
		className,
		...rest
	} = props;

	const cn = clsx(styles.menu, className);


	return h(as, { ref, className: cn, ...rest });
};

const MenuRef = forwardRef(Menu);

export { MenuRef as Menu };
