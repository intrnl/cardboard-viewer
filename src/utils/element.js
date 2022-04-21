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

export const handleFocusTrapping = (container, move = 0) => {
	const elements = findFocusable(container);
	const length = elements.length;

	if (length < 1) {
		container.focus();
		return;
	}

	const root = container.getRootNode();
	const focused = container.contains(root.activeElement) ? root.activeElement : null;

	let target = move < 0 ? -1 : 0;

	if (focused) {
		const index = elements.indexOf(focused);

		if (index > -1) {
			target = index + move;
		}
	}

	if (target < 0) {
		target = length - 1;
	}
	else {
		target = target % length;
	}

	const focusable = elements[target];
	focusable.focus();
};

export const findFocusable = (container) => {
	const matches = [];
	const nodes = container.querySelectorAll('*');

	for (let index = 0, length = nodes.length; index < length; index++) {
		const node = nodes[index];

		if (isFocusable(node)) {
			matches.push(node);
		}
	}

	return matches;
};
