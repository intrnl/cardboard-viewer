import { h } from '@intrnl/freak';

import clsx from 'clsx';
import * as styles from './MenuItem.css';


// <MenuItem />
export const MenuItem = (props) => {
	const {
		as = 'button',
		className,
		...rest
	} = props;

	const cn = clsx(styles.item, className);


	return h(as, { className: cn, ...rest });
};
