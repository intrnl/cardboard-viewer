import { h } from 'preact';
import { Suspense } from 'preact/compat';

import { Router } from '~/src/components/Router.jsx';
import { AppRouter } from '~/src/components/AppRouter.jsx';

import { history } from '~/src/globals/history.js';


export function App () {
	return (
		<Router history={history}>
			<Suspense fallback={<div>Loading...</div>}>
				<AppRouter />
			</Suspense>
		</Router>
	);
}
