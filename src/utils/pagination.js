export const PAGINATION_DOT_START = 'dots_start';
export const PAGINATION_DOT_END = 'dots_end';
export const PAGINATION_PREVIOUS = 'prev';
export const PAGINATION_NEXT = 'next';

export const createPagination = (page, total, boundaryCount = 1, siblingCount = 1) => {
	const pagesStart = range(1, Math.min(boundaryCount, total));
	const pagesEnd = range(Math.max(total - boundaryCount + 1, boundaryCount + 1), total);

	const siblingsStart = Math.max(
		Math.min(
			page - siblingCount,
			total - boundaryCount - siblingCount * 2 - 1,
		),
		boundaryCount + 2,
	);

	const siblingsEnd = Math.min(
		Math.max(
			page + siblingCount,
			boundaryCount + siblingCount * 2 + 2,
		),
		pagesEnd.length > 0 ? pagesEnd[0] - 2 : total - 1,
	);

	return [
		PAGINATION_PREVIOUS,
		...pagesStart,

		...(siblingsStart > boundaryCount + 2
			? [PAGINATION_DOT_START]
			: boundaryCount + 1 < total - boundaryCount
				? [boundaryCount + 1]
				: []),

		// Sibling pages
		...range(siblingsStart, siblingsEnd),


		...(siblingsEnd < total - boundaryCount - 1
			? [PAGINATION_DOT_END]
			: total - boundaryCount > boundaryCount
				? [total - boundaryCount]
				: []),

		...pagesEnd,
		PAGINATION_NEXT,
	];
};

const range = (start, end) => {
	const length = end - start + 1;
	return Array.from({ length }, (_, index) => start + index);
};
