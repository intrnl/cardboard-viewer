import { h, cloneElement } from 'preact';

import clsx from 'clsx';
import * as styles from './MenuTrigger.css';

import { computeFloatingPosition, handleFocusTrapping, isFocusable } from '~/utils/element';


export function MenuTrigger (props) {
	const {
		children,
		className,
		arrowNavigation = true,
		persist = false,
		placement,
	} = props;

	const [button, menu] = children;

	return (
		<details
			className={clsx(styles.container, className)}
			onToggle={handleToggle}
			onKeyDown={handleKeyDown}
			onClick={handleClick}
			data-arrownavigation={arrowNavigation}
			data-persist={persist}
			data-placement={placement}
		>
			<div className={styles.overlay} onClick={handleOverlayClick} />

			{cloneElement(button, {
				as: 'summary',
				role: 'button',
				'aria-haspopup': 'menu',
			})}

			{cloneElement(menu, {
				role: 'menu',
				className: clsx(styles.popup, menu.props.className),
			})}
		</details>
	);
}

async function handleToggle (event) {
	const details = event.currentTarget;

	if (details.open) {
		const summary = details.childNodes[1];
		const dialog = details.childNodes[2];

		const placement = details.getAttribute('data-placement');

		computeFloatingPosition(summary, dialog, placement);
		handleFocusTrapping(dialog);

		details.$s ||= (event) => handleOutsideScroll(event, details);
		document.addEventListener('scroll', details.$s, true);
	}
	else {
		const focusable = details.childNodes[1];
		focusable.focus();

		document.removeEventListener('scroll', details.$s, true);
	}
}

function handleOverlayClick (event) {
	const details = event.target.parentElement;
	details.removeAttribute('open');
}

function handleClick (event) {
	const details = event.currentTarget;
	const target = event.target;

	if (details.hasAttribute('data-persist')) {
		return;
	}

	if (!target.hasAttribute('data-dialog-persist') && isFocusable(target)) {
		details.removeAttribute('open');
	}
}

function handleKeyDown (event) {
	const details = event.currentTarget;
	const dialog = details.childNodes[2];

	if (!details.hasAttribute('open') || !dialog) {
		return;
	}

	const keyCode = event.keyCode;
	const arrow = details.hasAttribute('data-arrownavigation');

	if (keyCode === 27) {
		details.removeAttribute('open');
		return;
	}

	const isTab = keyCode === 9 || (arrow && (keyCode === 38 || keyCode === 40));
	const isReverse = (event.shiftKey && keyCode === 9) || keyCode === 38;

	if (!isTab) {
		return;
	}

	event.preventDefault();
	handleFocusTrapping(dialog, isReverse ? -1 : 1);
}

function handleOutsideScroll (event, details) {
	let target = event.target;

	while (target) {
		if (target === details) {
			return;
		}

		target = target.parentElement;
	}

	details.removeAttribute('open');
}
