import { h } from '@intrnl/freak';

import clsx from 'clsx';
import * as styles from './Menu.css';


// <Menu />
export const Menu = (props) => {
	const {
		as = 'div',
		className,
		...rest
	} = props;

	const cn = clsx(styles.menu, className);


	return h(as, { className: cn, ...rest });
};
