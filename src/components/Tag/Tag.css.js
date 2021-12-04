import { style } from '@vanilla-extract/css';

import { theme } from '~/styles/theme.css';


export const tag = style({
	display: 'flex',
	gap: 8,
});

export const link = style({
	color: 'inherit',
	textDecoration: 'none',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	overflow: 'hidden',

	':hover': {
		textDecoration: 'underline',
	},
}, 'link');

export const count = style({
	color: theme.palette.gray[400],
}, 'count');


export const isGeneral = style({
	color: theme.palette.blue[700],
}, 'is-general');

export const isArtist = style({
	color: theme.palette.red[700],
}, 'is-artist');

export const isCopyright = style({
	color: theme.palette.pink[700],
}, 'is-copyright');

export const isCharacter = style({
	color: theme.palette.green[700],
}, 'is-character');

export const isMeta = style({
	color: theme.palette.yellow[600],
}, 'is-meta');
