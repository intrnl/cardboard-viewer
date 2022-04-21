import { h } from 'preact';

import { useNavigateHandler, useHref } from '~/components/Router';


export const Link = (props) => {
	const { to, target, replace, state, onClick, ...rest } = props;

	const handle = useNavigateHandler(to, { target, replace, state, onClick })
	const href = useHref(to);


	return (
		<a {...rest} target={target} href={href} onClick={handle} />
	);
};
