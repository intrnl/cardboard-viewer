import { style, globalStyle } from '@vanilla-extract/css';

import { theme } from '~/styles/theme.css';
import { focusable } from '~/styles/misc/interactions.css';


export const post = style({
	backgroundColor: theme.palette.gray[200],
	position: 'relative',
});

const hasRelationship = style({
	borderStyle: 'solid',
	borderWidth: 2,
}, 'has-relationship');

export const isParent = style([hasRelationship, {
	borderColor: theme.palette.green[500],
}], 'is-parent');

export const isChild = style([hasRelationship, {
	borderColor: theme.palette.yellow[500],
}], 'is-child');

globalStyle(`${isParent}${isChild}`, {
	borderLeftColor: theme.palette.green[500],
	borderRightColor: theme.palette.yellow[500],
	borderTopColor: theme.palette.green[500],
	borderBottomColor: theme.palette.yellow[500],
});


export const link = style([focusable, {
	display: 'block',
	outlineOffset: 2,
}], 'link');

export const image = style({
	color: 'transparent',
}, 'image');


export const isFavorited = style({}, 'is-favorited');

export const favorite = style({
	all: 'unset',
	appearance: 'unset',
	cursor: 'pointer',
	color: theme.palette.white,
	padding: 4,
	position: 'absolute',
	top: 0,
	right: 0,
	zIndex: 2,

	selectors: {
		[`&${isFavorited}`]: {
			color: theme.palette.red[600],
		},
		[`&:focus-visible`]: {
			color: theme.palette.red[300],
		},
		[`&:disabled`]: {
			opacity: 0.25,
		},
	},
}, 'favorite');

export const favoriteIcon = style({
	stroke: theme.palette.black,
	strokeWidth: 2,
}, 'favorite-icon');
