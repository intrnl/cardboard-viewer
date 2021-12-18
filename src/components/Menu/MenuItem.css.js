import { style } from '@vanilla-extract/css';
import { px } from '@intrnl/cssom-utils';

import { theme } from '~/styles/theme.css';
import { button, isGhost } from '~/components/Button/Button.css';


export const item = style([button, isGhost, {
	fontWeight: 400,
	lineHeight: px(16),
	justifyContent: 'flex-start',
	height: 'auto',
	borderRadius: 0,

	selectors: {
		'&:is(:hover, :active, :focus-visible)': {
			color: theme.palette.white,
			backgroundColor: theme.palette.blue[600],
			outlineWidth: 0,
		},
	},
}]);
