import { style } from '@vanilla-extract/css';

import { theme } from '~/styles/theme.css';


export const relationship = style({
	gap: 16,
	padding: 16,
});


export const list = style({
	display: 'flex',
	alignItems: 'center',
	gap: 8,
	padding: 16,
	margin: -16,
	overflowX: 'auto',
}, 'list');


export const item = style({
	padding: 4,
	borderRadius: 4,
}, 'item');

export const isCurrent = style({
	backgroundColor: theme.palette.gray[300],
}, 'is-current');
