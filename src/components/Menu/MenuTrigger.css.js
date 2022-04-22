import { style } from '@vanilla-extract/css';


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
