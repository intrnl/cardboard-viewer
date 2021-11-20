import { h } from 'preact';

import * as styles from '~/src/styles/components/FlexSpacer.module.css';


export function FlexSpacer () {
	return h('div', { className: styles.spacer });
}
