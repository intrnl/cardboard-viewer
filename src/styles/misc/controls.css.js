import { style } from '@vanilla-extract/css';


export const control = style({
	borderRadius: 4,
});


export const isStart = style({
	borderTopRightRadius: 0,
	borderBottomRightRadius: 0,
}, 'is-start');

export const isMiddle = style({
	borderRadius: 0,
	marginLeft: -1,
}, 'is-middle');

export const isEnd = style({
	borderTopLeftRadius: 0,
	borderBottomLeftRadius: 0,
	marginLeft: -1,
}, 'is-end');
