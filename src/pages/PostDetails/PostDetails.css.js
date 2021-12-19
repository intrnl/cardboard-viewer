import { style } from '@vanilla-extract/css';
import { percent } from '@intrnl/cssom-utils';

import { theme } from '~/styles/theme.css';


export const main = style({
	gap: 8,
}, 'main');

const constrained = style({
	'@media': {
		'(max-width: 639px)': {
			borderInline: 0,
			borderRadius: 0,
			marginInline: -8,
		},
	},
}, 'constrained');


export const post = style([constrained, {
	overflow: 'hidden',
}], 'post');

export const container = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
}, 'container');

export const media = style({
	backgroundColor: theme.palette.gray[200],
	color: 'transparent',
	height: 'auto',
	maxWidth: percent(100),
}, 'media');

export const unsupported = style({
	padding: 16,
}, 'unsupported');

export const actions = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
	height: 48,
	paddingInline: 8,
	borderTopStyle: 'solid',
	borderTopWidth: 1,
	borderTopColor: theme.palette.gray[300],

	':empty': {
		display: 'none',
	},
}, 'actions');


export const relationship = style([constrained], 'relationship');


export const tags = style([constrained, {
	gap: 16,
	padding: 16,
}], 'tags');


export const favorited = style({
	color: theme.palette.red[600],
}, 'favorited');
