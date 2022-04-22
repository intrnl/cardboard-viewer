import { style } from '@vanilla-extract/css';
import { percent } from '@intrnl/cssom-utils';

import { theme } from '~/styles/theme.css';
import { focusable } from '~/styles/misc/interactions.css';
import { control } from '~/styles/misc/controls.css';


export const field = style([focusable, control, {
	color: theme.palette.black,
	backgroundColor: theme.palette.white,
	boxShadow: theme.shadow.small,
	minHeight: 32,
	paddingInline: 8,
	paddingBlock: 4,
	borderWidth: 1,
	borderColor: theme.palette.gray[300],

	':disabled': {
		color: theme.palette.gray[400],
		backgroundColor: theme.palette.gray[100],
	},

	'::placeholder': {
		color: theme.palette.gray[600],
	},

	selectors: {
		'&::-webkit-search-cancel-button': {
			display: 'none',
		},
	},
}]);

export const isFullWidth = style({
	width: percent(100),
}, 'is-full-width');
