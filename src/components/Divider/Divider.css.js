import { style } from '@vanilla-extract/css';

import { theme } from '~/styles/theme.css';


export const divider = style({
	alignSelf: 'stretch',
	height: 'unset',
	margin: 0,
	borderTop: '1px solid',
	borderRight: '1px solid',
	borderColor: theme.palette.gray[300],
});

export const isVertical = style({}, 'is-vertical');
export const isHorizontal = style({}, 'is-horizontal');


export const isGap = style({
	selectors: {
		[`&${isVertical}`]: {
			marginInline: 8,
		},
		[`&${isHorizontal}`]: {
			marginBlock: 8,
		},
	},
}, 'is-gap');
