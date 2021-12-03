import { style, globalStyle } from '@vanilla-extract/css';
import { percent, px, fr, vw, repeat, div } from '@intrnl/cssom-utils';


export const container = style({
	padding: 16,
	gap: 16,
});

export const main = style({
	gap: 16,
}, 'main');

export const listing = style({
	display: 'grid',
	gridTemplateColumns: repeat(3, fr(1)),
	justifyContent: 'center',
	justifyItems: 'center',
	alignItems: 'center',

	'@media': {
		'(min-width: 530px)': {
			gap: 16,
			gridTemplateColumns: repeat('auto-fit', px(152)),
		},
		'(max-width: 530px)': {
			marginInline: -16,
			overflow: 'hidden',
		},
	},
}, 'listing');

export const item = style({
	'@media': {
		'(max-width: 530px)': {
			width: div(vw(100), 3),
			height: percent(100),
			aspectRatio: `1`,
		},
	},
}, 'item');

globalStyle(`${item} img`, {
	'@media': {
		'(max-width: 530px)': {
			width: percent(100),
			height: percent(100),
			objectFit: 'cover',
			aspectRatio: `1`,
		},
	},
});
