import { h } from 'preact';

import clsx from 'clsx';
import { Icon } from '~/src/components/Icon.jsx';
import { Button } from '~/src/components/Button.jsx';
import * as styles from '~/src/styles/components/Pagination.module.css';

import DotsHorizIcon from '~/src/icons/dots-horizontal.svg';
import ChevronLeftIcon from '~/src/icons/chevron-left.svg';
import ChevronRightIcon from '~/src/icons/chevron-right.svg';

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
	const isEllipsis = value === PAGINATION_DOT_START || value === PAGINATION_DOT_END;


	return (
		<Button
			variant='ghost'
			className={clsx(styles.paginationButton, {
				[styles.isActive]: active,
				[styles.isPage]: isNumber,
				[styles.isEllipsis]: isEllipsis,
			})}
			disabled={disabled}
			onClick={onClick}
			value={value}
			aria-current={active}
			aria-label={retrieveLabel(value)}
		>
			{isNumber ?	value.toString() : <Icon src={retrieveIcon(value)} />}
		</Button>
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

function retrieveLabel (value) {
	switch (value) {
		case PAGINATION_DOT_START: return;
		case PAGINATION_DOT_END: return;
		case PAGINATION_PREVIOUS: return 'Previous page';
		case PAGINATION_NEXT: return 'Next page';
		default: return `Page ${value}`;
	}
}
