import { h, cloneElement } from 'preact';

import clsx from 'clsx';
import * as styles from './InputGroup.css';


export function InputGroup (props) {
	const { as = 'div', children, className, ...rest } = props;

	const length = children.length;
	const cn = clsx(styles.group, className);

	const mapped = children.map((child, index) => {
		const isStart = index === 0;
		const isEnd = index === length - 1;

		const position = isStart && isEnd
			? undefined
			: isStart
				? 'start'
				: isEnd
					? 'end'
					: 'middle';

		return cloneElement(child, { position });
	});

	return h(as, { className: cn, ...rest}, mapped);
}
