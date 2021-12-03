import { h } from 'preact';
import { Suspense } from 'preact/compat';
import { useState, useRef,  useLayoutEffect } from 'preact/hooks';

import clsx from 'clsx';
import { Link, isLinkEvent } from '~/src/components/Link';
import { Button } from '~/src/components/Button';
import { TextField } from '~/src/components/TextField';
import { InputGroup } from '~/src/components/InputGroup';
import { Menu, MenuItem } from '~/src/components/Menu';
import { Icon } from '~/src/components/Icon';
import * as styles from './TagSearch.css';

import SearchIcon from '~/src/icons/search.svg';

import { autocompleteTags } from '~/src/api/assets.js';

import { useDebouncedState } from '~/src/utils/useDebouncedState.js';


export function SearchInput (props) {
	const { value, onChange, onSearch, className } = props;

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

	const autocomplete = autocompleteTags.use(deferredInput, {
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
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		onSearch?.(event);
	};


	return (
		<form
			className={clsx(styles.search, className)}
			onSubmit={handleSubmit}
		>
			<InputGroup className={styles.container} onKeyDown={handleKeyDown}>
				<TextField
					ref={inputRef}
					type='search'
					autocomplete='off'
					fullWidth
					value={value}
					onChange={handleInput}
					placeholder='Search...'
				/>

				<Button title='Search' type='submit'>
					<Icon src={SearchIcon} />
				</Button>
			</InputGroup>

			{pendingInput && (
				<Suspense fallback={<AutocompleteListFallback />}>
					<AutocompleteList
						resource={autocomplete}
						selection={selection}
						onSelect={handleSelect}
					/>
				</Suspense>
			)}
		</form>
	);
}

function AutocompleteList (props) {
	const { resource, selection, onSelect } = props;

	const data = resource.read();

	if (!data) {
		return;
	}

	return (
		<Menu className={styles.menu}>
			{data.map((item, index) => (
				<AutocompleteItem
					data={item}
					index={index}
					selected={selection === index}
					onSelect={onSelect}
				/>
			))}
		</Menu>
	)
}

// <AutocompleteItem />
const countFormatter = new Intl.NumberFormat(undefined, {
	notation: 'compact',
})

function AutocompleteItem (props) {
	const { data, index, selected, onSelect } = props;

	const handleClick = (event) => {
		if (isLinkEvent(event)) {
			event.preventDefault();
		}

		onSelect?.(index);
	}

	return (
		<MenuItem
			as={Link}
			to={`/?query=${data.value}+`}
			tabIndex={-1}
			className={clsx(styles.item, selected && styles.isActive)}
			onClick={handleClick}
		>
			{data.label}

			{data.post_count && (
				<span className={styles.postCount}>
					{countFormatter.format(data.post_count)}
				</span>
			)}
		</MenuItem>
	);
}

function AutocompleteListFallback () {
	return (
		<Menu className={styles.menu}>
			<MenuItem disabled className={clsx(styles.item)}>
				loading...
			</MenuItem>
		</Menu>
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
