import { h } from 'preact';
import { Suspense } from 'preact/compat';
import { useState, useRef,  useLayoutEffect } from 'preact/hooks';
import { Link } from 'react-router-dom';

import clsx from 'clsx';
import * as styles from '~/src/styles/components/TagSearch.module.css';

import { autocompleteTags } from '~/src/api/asset.js';
import { useDebouncedState } from '~/src/utils/useDebouncedState';


export function SearchInput (props) {
	const { value, onChange } = props;

	const inputRef = useRef();

	/// Retrieve "pending" input
	// Pending input is when the last tag hasn't been ended with a space.
	const [pendingInput, setPendingInput] = useState('');
	const [pendingIndex, setPendingIndex] = useState(0);

	const deferredInput = useDebouncedState(pendingInput, 250);

	/// Autocomplete selection index
	// We should reset the index if the pending input changes.
	const [selection, setSelection] = useState(-1);

	useLayoutEffect(() => setSelection(-1), [pendingInput]);

	/// Autocomplete data
	// To allow for wrapping the selection index, we need the ability to peek
	// into its data. Peeking shouldn't throw a promise.
	const autocompleteList = autocompleteTags.read(deferredInput, {
		disabled: !deferredInput,
		readonly: true,
	});

	const autocomplete = autocompleteTags.get(deferredInput, {
		disabled: !deferredInput,
	});

	/// Handle events
	const applySelection = (selected) => {
		let padIndex = pendingIndex + pendingInput.length;
		let pad = 0;

		while (value[padIndex] === ' ') {
			padIndex++;
			pad++;
		}

		onChange(splice(value, pendingIndex, pendingInput.length + pad, selected + ' '));
		setPendingInput('');
	};

	const handleKeyDown = (event) => {
		// Ignore if the autocomplete list is empty.
		if (!autocompleteList?.length) {
			return;
		}

		if (selection > -1 && event.keyCode == 13) {
			// Enter
			event.preventDefault();

			const selected = autocompleteList[selection];
			applySelection(selected.value);
		}
		else if (event.keyCode === 38) {
			// Up arrow
			event.preventDefault();
			
			setSelection((selection <= -1 ? autocompleteList.length : selection) - 1);
		}
		else if (event.keyCode === 40) {
			// Down arrow
			event.preventDefault();

			setSelection((selection >= autocompleteList.length - 1 ? -2 : selection) + 1);
		}
	};

	const handleSelect = (index) => {
		const selected = autocompleteList[index];
		applySelection(selected.value);

		inputRef.current?.focus();
	};

	const handleInput = (event) => {
		const target = event.target;

		const value = target.value;
		const start = target.selectionStart;

		const space = value.lastIndexOf(' ', start - 1);
		
		const index = space < 0 ? 0 : space + 1;
		const input = value.slice(index, start);

		setPendingIndex(index);
		setPendingInput(input);

		onChange?.(value);
	}


	return (
		<div className={styles.container}>
			<input
				className={styles.input}
				autoFocus
				ref={inputRef}
				value={value}
				onChange={handleInput}
				onKeyDown={handleKeyDown}
				placeholder='Search'
			/>

			{pendingInput && (
				<Suspense fallback={<AutocompleteListFallback />}>
					<AutocompleteList
						resource={autocomplete}
						selection={selection}
						onSelect={handleSelect}
						onHover={setSelection}
					/>
				</Suspense>
			)}
		</div>
	);
}

function AutocompleteList (props) {
	const { resource, selection, onSelect, onHover } = props;

	const data = resource.read();

	if (!data) {
		return;
	}

	return (
		<ul className={styles.autocompletePopup}>
			{data.map((item, index) => (
				<AutocompleteItem
					data={item}
					index={index}
					selected={selection === index}
					onSelect={onSelect}
					onHover={onHover}
				/>
			))}
		</ul>
	)
}

function AutocompleteItem (props) {
	const { data, index, selected, onSelect, onHover } = props;

	return (
		<li
			className={styles.autocompleteItemContainer}
			onClick={() => onSelect?.(index)}
			onMouseEnter={() => onHover?.(index)}
		>
			<Link
				className={clsx(styles.autocompleteItem, selected && styles.isActive)}
				to={`/?query=${data.value}+`} onClick={handleNavigatePrevent}
			>

				{data.antecedent && `${data.antecedent} → `}
				{data.label}
			</Link>
		</li>
	);
}

function AutocompleteListFallback () {
	return (
		<ul className={styles.autocompletePopup}>
			<li className={styles.autocompleteItem}>
				loading...
			</li>
		</ul>
	);
}

function splice (string, index, count, replace = '') {
	return string.slice(0, index) + replace + string.slice(index + count);
}

// We want to make it so that the autocomplete functionality allows for quickly
// searching different tags in a new tab
function handleNavigatePrevent (event) {
	if (event.button === 0 && !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)) {
		event.preventDefault();
	}
}
