export function getPreviousSibling (element, selector, self) {
	element = self ? element : element.previousElementSibling;

	while (element) {
		const matches = selector ? element.matches(selector) : true;

		if (matches) {
			return element;
		}

		element = element.previousElementSibling;
	}
}

export function getNextSibling (element, selector, self) {
	element = self ? element : element.nextElementSibling;

	while (element) {
		const matches = selector ? element.matches(selector) : true;

		if (matches) {
			return element;
		}

		element = element.nextElementSibling;
	}
}
