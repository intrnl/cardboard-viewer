import { style } from '@vanilla-extract/css';

import { theme } from '../theme.css';


export const interactable = style({
	cursor: 'pointer',
}, 'interactable');

export const focusable = style({
	outlineColor: theme.palette.blue[600],
	outlineOffset: -1,

	':focus-visible': {
		outlineStyle: 'solid',
		outlineWidth: 2,
		zIndex: 1,
	},
}, 'focusable');
