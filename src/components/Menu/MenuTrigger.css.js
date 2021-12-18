import { style } from '@vanilla-extract/css';
import { vw, px, percent, mul, sub } from '@intrnl/cssom-utils';


export const container = style({
	position: 'relative',

	selectors: {
		'&[open]': {
			zIndex: 4,
		},
	},
});


export const overlay = style({
	selectors: {
		[`${container}[open] &`]: {
			display: 'block',
			position: 'fixed',
			inset: 0,
		},
	},
}, 'overlay');


export const popup = style({
	opacity: 0,
	minWidth: 250,
	maxWidth: sub(vw(100), mul(px(16), 2)),
	position: 'fixed',
	zIndex: 3,
}, 'popup');
