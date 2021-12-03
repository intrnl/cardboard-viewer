import { style } from '@vanilla-extract/css';
import { percent } from '@intrnl/cssom-utils';

import { theme } from '~/src/styles/theme.css';


export const search = style({
	width: percent(100),
	position: 'relative',
});

export const container = style({
	width: 'inherit',
}, 'container');


export const menu = style({
	width: percent(100),
	marginTop: 4,
	position: 'absolute',
	top: percent(100),

	selectors: {
		[`${search}:not(:focus-within) &`]: {
			display: 'none',
		},
	},
}, 'menu');


export const item = style({
	justifyContent: 'space-between',
}, 'item');

export const isActive = style({
	color: theme.palette.white,
	backgroundColor: theme.palette.blue[600],
}, 'is-active');


export const postCount = style({
	color: theme.palette.gray[600],

	selectors: {
		[`${item}:is(:hover, ${isActive}) &`]: {
			color: theme.palette.blue[200],
		},
	},
}, 'post-count');
