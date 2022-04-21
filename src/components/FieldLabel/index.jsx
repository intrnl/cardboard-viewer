import { h } from 'preact';
import { forwardRef } from 'preact/compat';

import clsx from 'clsx';
import * as styles from './FieldLabel.css';


const FieldLabel = (props, ref) => {
	const {
		as = 'label',
		className,
		...rest
	} = props;

	const cn = clsx(styles.label, className);


	return h(as, { ref, className: cn, ...rest });
};

const FieldLabelRef = forwardRef(FieldLabel);

export { FieldLabelRef as FieldLabel };
