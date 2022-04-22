import { style } from '@vanilla-extract/css';

import { theme } from '~/styles/theme.css';


export const card = style({
	backgroundColor: theme.palette.white,
	boxShadow: theme.shadow.main,
	display: 'flex',
	flexDirection: 'column',
	margin: 0,
	borderWidth: 1,
	borderColor: theme.palette.gray[300],
	borderRadius: 4,
});
