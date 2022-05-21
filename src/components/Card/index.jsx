import { h } from '@intrnl/freak';

import clsx from 'clsx';
import * as styles from './Card.css';


export const Card = (props) => {
	const {
		as = 'div',
		className,
		...rest
	} = props;

	const cn = clsx(styles.card, className);


	return h(as, { className: cn, ...rest });
};
