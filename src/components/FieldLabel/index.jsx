import { h } from '@intrnl/freak';

import clsx from 'clsx';
import * as styles from './FieldLabel.css';


export const FieldLabel = (props) => {
	const {
		as = 'label',
		className,
		...rest
	} = props;

	const cn = clsx(styles.label, className);


	return h(as, { className: cn, ...rest });
};
