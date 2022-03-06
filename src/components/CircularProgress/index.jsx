import { h } from 'preact';

import styles from './CircularProgress.module.css';


export function CircularProgress (props) {
	const { size = 32 } = props;


	return (
		<svg height={size} width={size} viewBox='22 22 44 44' className={styles.progress}>
			<circle cx={44} cy={44} r={20.2} />
		</svg>
	);
}
