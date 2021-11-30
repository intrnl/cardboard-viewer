import { h, cloneElement } from 'preact';

import clsx from 'clsx';
import * as styles from '~/src/styles/components/MenuTrigger.module.css';


export function MenuTrigger (props) {
	const { children, className, y = 'top', x = 'right' } = props;

	const [button, menu] = children;

	return (
		<details
			className={clsx(styles.container, className)}
			onToggle={handleToggle}
			onKeyDown={handleKeyDown}
			onClick={handleClick}
		>
			<div className={styles.overlay} onClick={handleOverlayClick} />

			{cloneElement(button, {
				as: 'summary',
				role: 'button',
				'aria-haspopup': 'menu',
			})}

			{cloneElement(menu, {
				role: 'menu',
				className: clsx(styles.popup, menu.props.className, {
					[styles.isTop]: y === 'top',
					[styles.isBottom]: y === 'bottom',
					[styles.isLeft]: x === 'left',
					[styles.isRight]: x === 'right',
				}),
			})}
		</details>
	);
}

function handleToggle (event) {
	const details = event.currentTarget;

	if (details.open) {
		const menu = details.childNodes[2];
		const elements = [...menu.querySelectorAll('*')].filter(isFocusable);

		const focusable = elements[0] || menu;
		focusable.focus();
	}
	else {
		const focusable = details.childNodes[1];
		focusable.focus();
	}
}

function handleOverlayClick (event) {
	const details = event.target.parentElement;
	details.removeAttribute('open');
}

function handleClick (event) {
	const details = event.currentTarget;
	const target = event.target;

	if (!target.matches('[data-menu-persist]') && isFocusable(target)) {
		details.removeAttribute('open');
	}
}

function handleKeyDown (event) {
	const details = event.currentTarget;
	const menu = details.childNodes[2];

	if (!details.hasAttribute('open') || !menu) {
		return;
	}

	const keyCode = event.keyCode;

	if (keyCode === 27) {
		details.removeAttribute('open');
		return;
	}

	const isTab = keyCode === 38 || keyCode === 40 || keyCode === 9;
	const isReverse = keyCode === 38 || (event.shiftKey && keyCode === 9);

	if (!isTab) {
		return;
	}

	event.preventDefault();

	const elements = [...menu.querySelectorAll('*')].filter(isFocusable);

	if (elements.length < 1) {
		return;
	}

	const movement = isReverse ? -1 : 1;
	const root = menu.getRootNode();
	const focused = menu.contains(root.activeElement) ? root.activeElement : null;

	let target = isReverse ? -1 : 0;

	if (focused) {
		const index = elements.indexOf(focused);

		if (index > -1) {
			target = index + movement;
		}
	}

	if (target < 0) {
		target = elements.length - 1;
	}
	else {
		target = target % elements.length;
	}

	const focusable = elements[target];
	focusable.focus();
}

function isFocusable (el) {
	return (
		el.tabIndex >= 0 &&
		!el.disabled &&
		isVisible(el)
	);
}

function isVisible (el) {
	return (
		!el.hidden &&
		(!el.type || el.type !== 'hidden') &&
		(el.offsetWidth > 0 || el.offsetHeight > 0)
	);
}
