import { style } from '@vanilla-extract/css';

import { theme } from '~/styles/theme.css';
import { interactable, focusable } from '~/styles/misc/interactions.css';
import { control } from '~/styles/misc/controls.css';


export const button = style([interactable, focusable, control, {
	fontWeight: 500,
	textDecoration: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	gap: 8,
	height: 32,
	minWidth: 32,
	padding: 8,
	border: 0,

	':disabled': {
		color: theme.palette.gray[400],
		pointerEvents: 'none',
	},
}]);


export const isPrimary = style({
	color: theme.palette.white,
	backgroundColor: theme.palette.blue[600],
	boxShadow: theme.shadow.small,

	':hover': {
		backgroundColor: theme.palette.blue[700],
	},
	':focus-visible': {
		outlineOffset: 2,
	},

	':disabled': {
		backgroundColor: theme.palette.blue[500],
		color: theme.palette.blue[200],
	},
}, 'is-primary');

export const isDefault = style({
	color: theme.palette.gray[800],
	backgroundColor: theme.palette.white,
	boxShadow: theme.shadow.small,
	borderWidth: 1,
	borderColor: theme.palette.gray[300],

	':hover': {
		backgroundColor: theme.palette.gray[50],
	},

	':disabled': {
		borderColor: theme.palette.gray[200],
	},
}, 'is-default');

export const isGhost = style({
	color: theme.palette.gray[800],
	backgroundColor: 'transparent',

	':hover': {
		backgroundColor: theme.palette.gray[200],
	},
}, 'is-ghost');

