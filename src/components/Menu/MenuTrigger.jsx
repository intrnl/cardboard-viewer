import { h, Fragment, cloneElement } from 'preact';
import { useState, useRef, useLayoutEffect } from 'preact/hooks';
import { computeFloatingPosition, isFocusable } from '~/utils/element';

import * as styles from './MenuTrigger.css';


export const MenuTrigger = (props) => {
	const { open, onChange, placement, children } = props;

	const [isOpen, setIsOpen] = useControllableState(false, open, onChange);

	const [trigger, menu] = children;

	const triggerRef = useRef();
	const dialogRef = useRef();

	const mergedRef = useMergeRefs([triggerRef, trigger.ref]);

	const handleClick = (ev) => {
		const prev = trigger.props.onClick;

		if (prev) {
			prev(ev);
		}

		setIsOpen(true);
	};

	const handleClose = () => {
		// we can't cancel close events, so we'll force it open
		const dialog = dialogRef.current;

		if (isOpen) {
			dialog.showModal();
		}
	};

	const handleCancel = (ev) => {
		ev.preventDefault();
		setIsOpen(false);
	};

	useLayoutEffect(() => {
		const dialog = dialogRef.current;
		const trigger = triggerRef.current;

		if (isOpen) {
			dialog.returnValue = '';

			dialog.showModal();
			document.documentElement.classList.add(styles.noScroll);

			computeFloatingPosition(trigger, dialog, placement);
		}
		else if (dialog.open) {
			dialog.close();
			document.documentElement.classList.remove(styles.noScroll);
		}
	}, [isOpen]);


	return (
		<>
			{cloneElement(trigger, {
				ref: mergedRef,
				onClick: handleClick,
			})}

			<dialog
				ref={dialogRef}
				className={styles.overlay}
				onClick={handleDialogClick}
				onClose={handleClose}
				oncancel={handleCancel}
			>
				{menu}
			</dialog>
		</>
	);
};

const handleDialogClick = (ev) => {
	const dialog = ev.currentTarget;
	const target = ev.target;

	if (
		(target === dialog) ||
		(isFocusable(target) && !target.hasAttribute('data-menu-persist'))
	) {
		dialog.dispatchEvent(new Event('cancel'));
	}
};

const useControllableState = (uncontrolled, controlled, onChange) => {
	const isControlled = controlled !== undefined;

	const [state, setState] = useState(uncontrolled);
	const currentState = isControlled ? controlled : state;

	const setControlledState = (value) => {
		if (isControlled) {
			if (onChange) {
				onChange(value);
			}
		}
		else {
			setState(value);
		}
	};

	return [currentState, setControlledState];
};

const useMergeRefs = (refs) => {
	const forwardRef = (node) => {
		for (const ref of refs) {
			if (typeof ref === 'function') {
				ref(node);
			}
			else if (typeof ref === 'object') {
				ref.current = node;
			}
		}
	};

	return forwardRef;
};
