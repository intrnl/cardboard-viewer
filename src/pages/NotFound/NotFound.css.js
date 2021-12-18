import { style } from '@vanilla-extract/css';
import { vh } from '@intrnl/cssom-utils';


export const container = style({
	textAlign: 'center',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	gap: 16,
	maxWidth: 500,
	minHeight: vh(100),
	padding: 16,
	marginInline: 'auto',
}, 'container');
