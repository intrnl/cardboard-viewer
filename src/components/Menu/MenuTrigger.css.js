import { style } from '@vanilla-extract/css';
import { percent } from '@intrnl/cssom-utils';


export const overlay = style({
	background: 'transparent',
	minWidth: 250,
	padding: 0,
	margin: 0,
	border: 0,
	overflow: 'visible',

	selectors: {
		'&::backdrop': {
			background: 'transparent',
		},
	},
}, 'overlay');

export const noScroll = style({
	position: 'fixed',
	overflowY: 'scroll',
	width: percent(100),
}, 'no-scroll');
