import { h } from 'preact';

import clsx from 'clsx';
import { Icon } from '~/components/Icon';
import { Button } from '~/components/Button';
import * as styles from './Pagination.css';

import DotsHorizIcon from '~/icons/dots-horizontal.svg';
import ChevronLeftIcon from '~/icons/chevron-left.svg';
import ChevronRightIcon from '~/icons/chevron-right.svg';

import { useFactoryMemo } from '~/utils/useFactoryMemo.js';
import {
	createPagination,
	PAGINATION_DOT_START,
	PAGINATION_DOT_END,
	PAGINATION_NEXT,
	PAGINATION_PREVIOUS,
} from '~/utils/pagination.js';


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
			let ret = prompt(`Go to page? (${page}/${total})`);
			value = parseInt(ret);

			if (!ret) {
				return;
			}

			if (!Number.isFinite(value) || value < 1 || value > total) {
				alert(`Invalid page: ${ret}`);
				return;
			}
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
		<button
			className={clsx(styles.button, {
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

function retrieveLabel (value) {
	switch (value) {
		case PAGINATION_DOT_START: return;
		case PAGINATION_DOT_END: return;
		case PAGINATION_PREVIOUS: return 'Previous page';
		case PAGINATION_NEXT: return 'Next page';
		default: return `Page ${value}`;
	}
}
