import { style } from '@vanilla-extract/css';
import { px, fr, minmax } from '@intrnl/cssom-utils';


export const MINIMUM_WIDTH = px(1024);
export const MAIN_WIDTH = px(850);
export const ASIDE_WIDTH = px(330);


export const container = style({
	display: 'grid',
	gridTemplateAreas: '"main" "aside"',
	gridTemplateColumns: `${minmax(0, MAIN_WIDTH)}`,
	justifyContent: 'center',
	gap: 8,
	padding: 8,

	'@media': {
		[`(min-width: ${MINIMUM_WIDTH})`]: {
			gridTemplateAreas: '"main aside"',
			gridTemplateColumns: `${minmax(0, MAIN_WIDTH)} ${ASIDE_WIDTH}`,
		},
	},
});

export const isFlow = style({
	'@media': {
		[`(min-width: ${MINIMUM_WIDTH})`]: {
			gridTemplateColumns: `${minmax(0, fr(1))} ${ASIDE_WIDTH}`,
		},
	},
}, 'is-flow');


const area = style({
	display: 'flex',
	flexDirection: 'column',
}, 'area');

export const main = style([area, {
	gridArea: 'main',
}], 'main');

export const aside = style([area, {
	gridArea: 'aside',
}], 'aside');
