import { h } from 'preact';
import { Suspense } from 'preact/compat';

import { Router } from '~/src/components/Router.jsx';
import { AppRouter } from '~/src/components/AppRouter.jsx';
import { CircularProgress } from '~/src/components/CircularProgress.jsx';
import * as styles from '~/src/styles/components/App.module.css';

import { history } from '~/src/globals/history.js';


export function App () {
	return (
		<Router history={history}>
			<Suspense fallback={<AppFallback />}>
				<AppRouter />
			</Suspense>
		</Router>
	);
}

function AppFallback () {
	return (
		<div className={styles.fallback}>
			<CircularProgress />
		</div>
	);
}
