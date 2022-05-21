import { h } from '@intrnl/freak';

import { Icon } from '~/components/Icon';
import * as styles from './CircularProgress.css';

import RefreshIcon from '~/icons/refresh.svg';


const query = matchMedia('(prefers-reduced-motion: reduce)');
let isReduceMotion = query.matches;

query.addEventListener('change', (ev) => {
	isReduceMotion = ev.matches;
});

export const CircularProgress = (props) => {
	const { size = 32 } = props;

	if (isReduceMotion) {
		return (
			<Icon src={RefreshIcon} size={size} className={styles.progress} />
		);
	}

	return (
		<svg height={size} width={size} viewBox='22 22 44 44' className={styles.progressAnimate}>
			<circle cx={44} cy={44} r={20.2} />
		</svg>
	);
};
