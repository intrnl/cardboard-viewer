import { h } from 'preact';

import styles from './FlexSpacer.module.css';


export function FlexSpacer () {
	return h('div', { className: styles.spacer });
}
