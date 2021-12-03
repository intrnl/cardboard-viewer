import { style } from '@vanilla-extract/css';

import { theme } from '~/src/styles/theme.css';
import { button as baseButton, isGhost } from '~/src/components/Button/Button.css';


export const pagination = style({
	display: 'flex',
	justifyContent: 'center',
	gap: 8,
});


export const isPage = style({}, 'is-page');
export const isEllipsis = style({}, 'is-ellipsis');

export const isActive = style({}, 'is-active');

export const button = style([baseButton, isGhost, {
	selectors: {
		[`&${isActive}`]: {
			fontWeight: 700,
			color: theme.palette.blue[900],
			backgroundColor: theme.palette.blue[100],
		},
	},

	'@media': {
		'(max-width: 530px)': {
			selectors: {
				[`&:is(${isPage}:not(${isActive}), ${isEllipsis})`]: {
					display: 'none',
				},
			},
		},
	},
}], 'button');
