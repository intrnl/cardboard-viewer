import { style } from '@vanilla-extract/css';
import { vh } from '@intrnl/cssom-utils';


export const fallback = style({
	minHeight: '100vh',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	padding: 16,
}, 'fallback');

export const error = style([fallback, {
	maxWidth: 500,
	gap: 16,
	marginInline: 'auto',
}], 'error');

