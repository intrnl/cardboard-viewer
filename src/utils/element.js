export function isFocusable (el) {
	return (
		el.tabIndex >= 0 &&
		!el.disabled &&
		isVisible(el)
	);
}

export function isVisible (el) {
	return (
		!el.hidden &&
		(!el.type || el.type !== 'hidden') &&
		(el.offsetWidth > 0 || el.offsetHeight > 0)
	);
}

export function handleFocusTrapping (container, move = 0) {
	const elements = [...container.querySelectorAll('*')].filter(isFocusable);
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
}
