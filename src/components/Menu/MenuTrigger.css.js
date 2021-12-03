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
	minWidth: 250,
	maxWidth: sub(vw(100), mul(px(16), 2)),
	marginTop: 4,
	position: 'absolute',
}, 'popup');


export const isTop = style({
	top: percent(100),
}, 'is-top');

export const isBottom = style({
	bottom: percent(100),
}, 'is-bottom');

export const isLeft = style({
	left: 0,
}, 'is-left');

export const isRight = style({
	right: 0,
}, 'is-right');
