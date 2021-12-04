import { style } from '@vanilla-extract/css';
import { vh } from '@intrnl/cssom-utils';

import { theme } from '~/styles/theme.css';


export const container = style({
	backgroundColor: theme.palette.gray[100],
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	gap: 16,
	minHeight: vh(100),
	paddingBlock: 32,

	'@media': {
		'(max-width: 639px)': {
			alignItems: 'stretch',
		},
	},
});

export const card = style({
	gap: 16,
	padding: 16,

	'@media': {
		'(max-width: 639px)': {
			borderInline: 0,
			borderRadius: 0,
		},
		'(min-width: 640px)': {
			width: 380,
		},
	},
}, 'card');


export const blurb = style({
	fontSize: 13,
	color: theme.palette.gray[600],
}, 'blurb');
