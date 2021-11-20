import { h } from 'preact';

import * as styles from '~/src/styles/layouts/MainLayout.module.css';


export function MainLayout (props) {
	return (
		<div className={styles.container}>
			<div className={styles.body}>
				<main className={styles.main}>
					{props.children}
				</main>
				<aside className={styles.aside}>
					{props.aside}
				</aside>
			</div>
		</div>
	);
}
