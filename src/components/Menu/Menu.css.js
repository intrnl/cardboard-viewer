import { style } from '@vanilla-extract/css';

import { theme } from '~/src/styles/theme.css';


export const menu = style({
	backgroundColor: theme.palette.white,
	boxShadow: theme.shadow.large,
	display: 'flex',
	flexDirection: 'column',
	paddingBlock: 4,
	borderStyle: 'solid',
	borderWidth: 1,
	borderColor: theme.palette.gray[300],
	borderRadius: 4,
	zIndex: 3,
});
