import { h } from 'preact';
import { Suspense } from 'preact/compat';

import { Router } from './Router';
import { AppRouter } from './AppRouter';
import { CircularProgress } from '~/src/components/CircularProgress';
import * as styles from './App.css';

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
