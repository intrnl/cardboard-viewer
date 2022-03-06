import { h } from 'preact';

import clsx from 'clsx';
import styles from './SideView.module.css';


export function SideView (props) {
	const { children, flow, className } = props;

	const cn = clsx(styles.container, {
		[styles.isFlow]: flow,
	}, className);


	return (
		<div className={cn}>
			{children}
		</div>
	);
}

export function Main (props) {
	const { children, className } = props;

	const cn = clsx(styles.main, className);


	return (
		<main className={cn}>
			{children}
		</main>
	);
}

export function Aside (props) {
	const { children, className } = props;

	const cn = clsx(styles.aside, className);


	return (
		<aside className={cn}>
			{children}
		</aside>
	);
}
