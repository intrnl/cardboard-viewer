import { h } from 'preact';
import { useState, useRef } from 'preact/hooks';
import { useQuery } from '@intrnl/rq';

import clsx from 'clsx';
import { Link } from '~/components/Link';
import { isLinkEvent } from '~/components/Router';
import { Button } from '~/components/Button';
import { TextField } from '~/components/TextField';
import { InputGroup } from '~/components/InputGroup';
import { Menu, MenuItem } from '~/components/Menu';
import { Icon } from '~/components/Icon';
import * as styles from './TagSearch.css';

import SearchIcon from '~/icons/search.svg';

import { getTagCompletion } from '~/api/assets';

import { useDebouncedState } from '~/utils/useDebouncedState';


export const SearchInput = (props) => {
	const { value, onChange, onSearch, className } = props;

	const inputRef = useRef();

	/// Retrieve "pending" input
	// Pending input is when the last tag hasn't been ended with a space.
	const [pendingInput, setPendingInputRaw] = useState('');
	const [pendingIndex, setPendingIndex] = useState(0);

	const deferredInput = useDebouncedState(pendingInput, 500);

	/// Autocomplete selection index
	// We should reset the index if the pending input changes.
	const [selection, setSelection] = useState(-1);

	/// Autocomplete data
	const { status, data } = useQuery({
		disabled: !deferredInput,
		key: ['tag/autocomplete', deferredInput],
		fetch: getTagCompletion,
	});

	/// Handle events
	const setPendingInput = (next) => {
		setPendingInputRaw(next);
		setSelection(-1);
	};

	const applySelection = (selected) => {
		let padIndex = pendingIndex + pendingInput.length;
		let pad = 0;

		while (value[padIndex] === ' ') {
			padIndex++;
			pad++;
		}

		onChange(splice(value, pendingIndex, pendingInput.length + pad, selected + ' '));
		setPendingInput('');

		inputRef.current?.focus();
	};

	const handleKeyDown = (event) => {
		// Ignore if the autocomplete list is empty.
		if (!data?.length) {
			return;
		}

		const key = event.keyCode;

		if (selection > -1 && key == 13) {
			// Enter
			event.preventDefault();

			const selected = data[selection];
			applySelection(selected.value);
		}
		else if (key === 27) {
			event.preventDefault();

			setPendingInput('');
		}
		else if (key === 38) {
			// Up arrow
			event.preventDefault();

			setSelection((selection <= -1 ? data.length : selection) - 1);
		}
		else if (key === 40) {
			// Down arrow
			event.preventDefault();

			setSelection((selection >= data.length - 1 ? -2 : selection) + 1);
		}
	};

	const handleSelect = (index) => {
		const selected = data[index];
		applySelection(selected.value);
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
					) : data.length > 0 ? (
						data.map((item, index) => (
							<AutocompleteItem
								data={item}
								index={index}
								selected={selection === index}
								onSelect={handleSelect}
							/>
						))
					) : (
						<MenuItem disabled className={styles.item}>
							no results
						</MenuItem>
					)}
				</Menu>
			)}
		</form>
	);
};

// <AutocompleteItem />
const countFormatter = new Intl.NumberFormat(undefined, {
	notation: 'compact',
})

const AutocompleteItem = (props) => {
	const { data, index, selected, onSelect } = props;

	const handleClick = (event) => {
		if (!isLinkEvent(event)) {
			return;
		}

		event.preventDefault();
		onSelect?.(index);
	}

	return (
		<MenuItem
			as={Link}
			to={`/?tags=${data.value}+`}
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
};

const splice = (string, index, count, replace = '') => {
	return string.slice(0, index) + replace + string.slice(index + count);
};
