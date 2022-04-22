import { style } from '@vanilla-extract/css';
import { vh } from '@intrnl/cssom-utils';

import { theme } from '~/styles/theme.css';


export const container = style({
	minHeight: vh(100),
	display: 'flex',
	flexDirection: 'column',
});

export const fallback = style({
	display: 'flex',
	flexDirection: 'column',
	padding: 16,
}, 'fallback');


export const header = style({
	backgroundColor: theme.palette.white,
	display: 'flex',
	alignItems: 'center',
	height: 48,
	gap: 8,
	paddingInline: 8,
	borderBottomWidth: 1,
	borderColor: theme.palette.gray[300],
}, 'header');

export const search = style({
	flexGrow: 1,

	'@media': {
		'(min-width: 768px)': {
			maxWidth: 400,
		},
	},
}, 'search');


export const desktop = style({
	display: 'none',

	'@media': {
		'(min-width: 768px)': {
			display: 'contents',
		},
	},
}, 'desktop');

export const mobile = style({
	marginLeft: 'auto',

	'@media': {
		'(min-width: 768px)': {
			display: 'none',
		},
	},
}, 'mobile');
