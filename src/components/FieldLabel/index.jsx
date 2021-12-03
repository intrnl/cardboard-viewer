import { h } from 'preact';
import { forwardRef } from 'preact/compat';

import clsx from 'clsx';
import * as styles from './FieldLabel.css';


const FieldLabelRef = forwardRef(FieldLabel);

function FieldLabel (props, ref) {
	const {
		as = 'label',
		className,
		...rest
	} = props;

	const cn = clsx(styles.label, className);


	return h(as, { ref, className: cn, ...rest });
}

export { FieldLabelRef as FieldLabel };
