import { h } from 'preact';

import clsx from 'clsx';
import * as styles from '~/src/styles/components/Pagination.module.css';
import { Icon } from '~/src/components/Icon.jsx';

import DotsHorizIcon from '~/src/icons/dots-horizontal.svg?url';
import ChevronLeftIcon from '~/src/icons/chevron-left.svg?url';
import ChevronRightIcon from '~/src/icons/chevron-right.svg?url';

import { useFactoryMemo } from '~/src/utils/useFactoryMemo.js';
import {
	createPagination,
	PAGINATION_DOT_START,
	PAGINATION_DOT_END,
	PAGINATION_NEXT,
	PAGINATION_PREVIOUS,
} from '../utils/pagination.js';


export function Pagination (props) {
	const { page, total, onChangePage } = props;

	const pagination = useFactoryMemo(createPagination, [page, total]);

	const handleClick = (event) => {
		let value = event.currentTarget.value;

		switch (value) {
			case PAGINATION_NEXT: value = page + 1; break;
			case PAGINATION_PREVIOUS: value = page - 1; break;
			case PAGINATION_DOT_START: return;
			case PAGINATION_DOT_END: return;
		}

		value = parseInt(value);

		if (value === page) {
			return;
		}

		onChangePage?.(value);
	};

	return (
		<div className={styles.pagination}>
			{pagination.map((value) => {
				const isNumber = typeof value === 'number';
				const isActive = page === value;

				const isDisabled = !isNumber && (
					(value === PAGINATION_DOT_START) ||
					(value === PAGINATION_DOT_END) ||
					(value === PAGINATION_NEXT ? page >= total : page <= 1)
				);

				return (
					<PaginationButton
						key={value}
						value={value}
						active={isActive}
						disabled={isDisabled}
						onClick={handleClick}
					/>
				)
			})}
		</div>
	);
}

export function PaginationButton (props) {
	const { value, active, disabled, onClick } = props;

	const isNumber = typeof value === 'number';

	return (
		<button
			className={clsx(styles.paginationButton, active && styles.isActive)}
			disabled={disabled}
			onClick={onClick}
			value={value}
			aria-current={active}
		>
			{isNumber ?	value.toString() : <Icon src={retrieveIcon(value)} />}
		</button>
	);
}

function retrieveIcon (value) {
	switch (value) {
		case PAGINATION_DOT_START: return DotsHorizIcon;
		case PAGINATION_DOT_END: return DotsHorizIcon;
		case PAGINATION_PREVIOUS: return ChevronLeftIcon;
		case PAGINATION_NEXT: return ChevronRightIcon;
	}
}
