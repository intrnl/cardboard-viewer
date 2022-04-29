import { style, globalStyle, keyframes } from '@vanilla-extract/css';


const rotate = keyframes({
	'0%': {
		transformOrigin: ['50%', '50%'],
	},
	'100%': {
		transform: 'rotate(360deg)',
	},
}, 'rotate');

export const progress = style({
	alignSelf: 'center',
});

export const progressAnimate = style([progress, {
	animation: `${rotate} 1.4s linear infinite`,
}], 'animate');

globalStyle(`${progressAnimate} circle`, {
	fill: 'none',
	stroke: 'currentColor',
	strokeWidth: 3.6,
	strokeDasharray: '80px, 200px',
	strokeDashoffset: 0,
});
