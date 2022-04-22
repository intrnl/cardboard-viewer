import { reposition } from 'nanopop';


export const computeFloatingPosition = (reference, floating, placement) => {
	reposition(reference, floating, {
		position: placement ?? 'bottom',
		margin: 4,
	});

	floating.style.opacity = '1';
};

export const isFocusable = (el) => {
	return (
		el.tabIndex >= 0 &&
		!el.disabled &&
		isVisible(el)
	);
};

export const isVisible = (el) => {
	return (
		!el.hidden &&
		(!el.type || el.type !== 'hidden') &&
		(el.offsetWidth > 0 || el.offsetHeight > 0)
	);
};
