import { h } from 'preact';
import { useHref, useNavigate, useLocation, useResolvedPath } from 'react-router-dom';
import { createPath } from 'history';


export function Link (props) {
	const { to, replace, onClick, ...rest } = props;

	const location = useLocation();
	const navigate = useNavigate();

	const href = useHref(to);
	const path = useResolvedPath(to);


	const handleClick = (event) => {
		onClick?.(event);

		if (!event.defaultPrevented && isLinkEvent(event)) {
			event.preventDefault();

			const repl = replace || createPath(location) === createPath(path);
			navigate(to, { replace: repl });
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	return (
		<a {...rest} href={href} onClick={handleClick} />
	);
}

export function isLinkEvent (event) {
	const target = event.target.target;

	return (
		event.button === 0 &&
		(!target || target === '_self') &&
		!isModifiedEvent(event)
	);
}

function isModifiedEvent (event) {
	return event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;
}
