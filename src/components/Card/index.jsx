import { h } from 'preact';
import { forwardRef } from 'preact/compat';

import clsx from 'clsx';
import * as styles from './Card.css';


const CardRef = forwardRef(Card);

function Card (props, ref) {
	const {
		as = 'div',
		className,
		...rest
	} = props;

	const cn = clsx(styles.card, className);


	return h(as, { ref, className: cn, ...rest });
}

export { CardRef as Card };
