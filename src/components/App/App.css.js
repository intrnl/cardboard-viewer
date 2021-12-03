import { style } from '@vanilla-extract/css';
import { vh } from '@intrnl/cssom-utils';


export const fallback = style({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	height: vh(100),
}, 'fallback');
