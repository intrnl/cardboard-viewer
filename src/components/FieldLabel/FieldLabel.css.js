import { style } from '@vanilla-extract/css';

import { theme } from '~/src/styles/theme.css';


export const label = style({
	color: theme.palette.gray[800],
	fontWeight: 500,
	display: 'flex',
	flexDirection: 'column',
	gap: 4,
});
