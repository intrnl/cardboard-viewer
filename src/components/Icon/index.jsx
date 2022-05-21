import { h } from '@intrnl/freak';

import clsx from 'clsx';
import * as styles from './Icon.css';


export const Icon = (props) => {
	const { src, size = 16, className } = props;

	const cn = clsx(styles.icon, className);


	return (
		<svg height={size} width={size} className={cn}>
			<use href={src + '#icon'} />
		</svg>
	);
};
