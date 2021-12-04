import { h } from 'preact';
import { Suspense } from 'preact/compat';
import { useState, useRef,  useLayoutEffect } from 'preact/hooks';

import clsx from 'clsx';
import { Link, isLinkEvent } from '~/components/Link';
import { Button } from '~/components/Button';
import { TextField } from '~/components/TextField';
import { InputGroup } from '~/components/InputGroup';
import { Menu, MenuItem } from '~/components/Menu';
import { Icon } from '~/components/Icon';
import * as styles from './TagSearch.css';

import SearchIcon from '~/icons/search.svg';

import { autocompleteTags } from '~/api/assets.js';

import { useDebouncedState } from '~/utils/useDebouncedState.js';
import { useId } from '~/utils/useId.js';


export function SearchInput (props) {
	const { value, onChange, onSearch, className } = props;

	const inputRef = useRef();
	const prefix = useId();

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
			<InputGroup className={styles.container}>
				<TextField
					ref={inputRef}
					type='search'
					autocomplete='off'
					fullWidth
					value={value}
					onChange={handleInput}
					onKeyDown={handleKeyDown}
					placeholder='Search...'
					aria-label='Search'
					role='combobox'
					aria-controls={prefix + 'menu'}
					aria-autocomplete='list'
					aria-haspopup='listbox'
					aria-activedescendant={selection !== -1 && (prefix + selection)}
					aria-expanded={!!pendingInput}
				/>

				<Button title='Search' type='submit'>
					<Icon src={SearchIcon} />
				</Button>
			</InputGroup>

			{pendingInput && (
				<Menu as='ul' className={styles.menu} id={prefix + 'menu'} role='listbox'>
					<Suspense fallback={<AutocompleteListFallback />}>
						<AutocompleteList
							resource={autocomplete}
							selection={selection}
							onSelect={handleSelect}
							a11yPrefix={prefix}
						/>
					</Suspense>
				</Menu>
			)}
		</form>
	);
}

function AutocompleteList (props) {
	const { resource, selection, onSelect, a11yPrefix } = props;

	const data = resource.read();

	if (!data) {
		return;
	}

	return data.map((item, index) => (
		<AutocompleteItem
			data={item}
			index={index}
			selected={selection === index}
			onSelect={onSelect}
			a11yPrefix={a11yPrefix}
		/>
	));
}

// <AutocompleteItem />
const aggregateFormatter = new Intl.NumberFormat(undefined, {
	notation: 'compact',
});
const a11yFormatter = new Intl.NumberFormat();

function AutocompleteItem (props) {
	const { data, index, selected, onSelect, a11yPrefix } = props;

	const handleClick = (event) => {
		if (isLinkEvent(event)) {
			event.preventDefault();
		}

		onSelect?.(index);
	}

	const label = data.label;
	const count = data.post_count;

	const aggregateCount = aggregateFormatter.format(count);
	const a11yCount = a11yFormatter.format(count);

	return (
		<li id={a11yPrefix + index} role='option' aria-selected={selected}>
			<MenuItem
				as={Link}
				to={`/?query=${data.value}+`}
				tabIndex={-1}
				className={clsx(styles.item, selected && styles.isActive)}
				onClick={handleClick}
				aria-label={`${label}, Has ${a11yCount} posts.`}
			>
				{label}

				{data.post_count && (
					<span className={styles.postCount}>
						{aggregateCount}
					</span>
				)}
			</MenuItem>
		</li>
	);
}

function AutocompleteListFallback () {
	return (
		<MenuItem disabled className={styles.item}>
			loading...
		</MenuItem>
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
