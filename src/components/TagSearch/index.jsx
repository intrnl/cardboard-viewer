import { h } from 'preact';
import { useState, useRef,  useLayoutEffect } from 'preact/hooks';
import { useQuery } from '~/lib/rq';

import clsx from 'clsx';
import { Link, isLinkEvent } from '~/components/Link';
import { Button } from '~/components/Button';
import { TextField } from '~/components/TextField';
import { InputGroup } from '~/components/InputGroup';
import { Menu, MenuItem } from '~/components/Menu';
import { Icon } from '~/components/Icon';
import { useErrorBoundary } from '~/components/ErrorBoundary';
import * as styles from './TagSearch.css';

import SearchIcon from '~/icons/search.svg';

import { getTagCompletion } from '~/api/assets.new';

import { useDebouncedState } from '~/utils/useDebouncedState.js';


export function SearchInput (props) {
	const { value, onChange, onSearch, className } = props;

	const inputRef = useRef();

	/// Retrieve "pending" input
	// Pending input is when the last tag hasn't been ended with a space.
	const [pendingInput, setPendingInput] = useState('');
	const [pendingIndex, setPendingIndex] = useState(0);

	const deferredInput = useDebouncedState(pendingInput, 500);

	/// Autocomplete selection index
	// We should reset the index if the pending input changes.
	const [selection, setSelection] = useState(-1);

	useLayoutEffect(() => setSelection(-1), [pendingInput]);

	/// Autocomplete data
	const { status, data, error } = useQuery({
		disabled: !deferredInput,
		key: ['tag/autocomplete', deferredInput],
		fetch: getTagCompletion,
	});

	useErrorBoundary(error);

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
		if (!data?.length) {
			return;
		}

		if (selection > -1 && event.keyCode == 13) {
			// Enter
			event.preventDefault();

			const selected = data[selection];
			applySelection(selected.value);
		}
		else if (event.keyCode === 38) {
			// Up arrow
			event.preventDefault();

			setSelection((selection <= -1 ? data.length : selection) - 1);
		}
		else if (event.keyCode === 40) {
			// Down arrow
			event.preventDefault();

			setSelection((selection >= data.length - 1 ? -2 : selection) + 1);
		}
	};

	const handleSelect = (index) => {
		const selected = data[index];
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
		<form className={clsx(styles.search, className)} onSubmit={handleSubmit}>
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

			{deferredInput && pendingInput && (
				<Menu className={styles.menu}>
					{status === 'loading' ? (
						<MenuItem disabled className={styles.item}>
							loading...
						</MenuItem>
					) : (
						data.map((item, index) => (
							<AutocompleteItem
								data={item}
								index={index}
								selected={selection === index}
								onSelect={handleSelect}
							/>
						))
					)}
				</Menu>
			)}
		</form>
	);
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

function splice (string, index, count, replace = '') {
	return string.slice(0, index) + replace + string.slice(index + count);
}
