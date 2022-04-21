import { h } from 'preact';
import { useState, useLayoutEffect } from 'preact/hooks';
import { Router as ReactRouter } from 'react-router-dom';


export const Router = (props) => {
	const { history, basename, children } = props;

	const [state, setState] = useState({
		action: history.action,
		location: history.location,
	});

	useLayoutEffect(() => history.listen(setState), [history]);

	return (
		<ReactRouter
			children={children}
			basename={basename}
			navigator={history}
			action={state.action}
			location={state.location}
		/>
	);
};
