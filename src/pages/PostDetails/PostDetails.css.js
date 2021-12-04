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
		},
	},
})


export const post = style([constrained], 'post');

export const container = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	borderRadius: 4,
	overflow: 'hidden',
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
	backgroundColor: `rgba(255, 255, 255, 0.85)`,
	display: 'flex',
	height: 48,
	paddingInline: 16,
	position: 'sticky',
	bottom: 0,
}, 'actions');


export const relationship = style([constrained], 'relationship');


export const tags = style([constrained, {
	gap: 16,
	padding: 16,
}], 'tags');

export const tagHeader = style({
	fontSize: 14,
}, 'tag-header');
