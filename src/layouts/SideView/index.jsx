import { h } from '@intrnl/freak';

import clsx from 'clsx';
import * as styles from './SideView.css';


export const SideView = (props) => {
	const { children, flow, className } = props;

	const cn = clsx(styles.container, {
		[styles.isFlow]: flow,
	}, className);


	return (
		<div className={cn}>
			{children}
		</div>
	);
};

export const Main = (props) => {
	const { children, className } = props;

	const cn = clsx(styles.main, className);


	return (
		<main className={cn}>
			{children}
		</main>
	);
};

export const Aside = (props) => {
	const { children, className } = props;

	const cn = clsx(styles.aside, className);


	return (
		<aside className={cn}>
			{children}
		</aside>
	);
};
