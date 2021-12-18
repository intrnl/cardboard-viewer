import { style } from '@vanilla-extract/css';


export const container = style({
	textAlign: 'center',
	flexGrow: 1,
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	gap: 16,
	maxWidth: 500,
	padding: 16,
	marginInline: 'auto',
});
