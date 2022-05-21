import { h, Suspense, useEffect } from '@intrnl/freak';

import { AppRouter } from './AppRouter';
import { Router } from '~/components/Router';
import { ErrorBoundary } from '~/components/ErrorBoundary';
import { CircularProgress } from '~/components/CircularProgress';
import { Button } from '~/components/Button';
import * as styles from './App.css';

import { history } from '~/globals/history.js';


export const App = () => {
	return (
		<ErrorBoundary fallback={ErrorContainer}>
			<Router history={history}>
				<Suspense fallback={<AppFallback />}>
					<AppRouter />
				</Suspense>
			</Router>
		</ErrorBoundary>
	);
};

const AppFallback = () => {
	return (
		<div className={styles.fallback}>
			<CircularProgress />
		</div>
	);
};

const ErrorContainer = (props) => {
	const { error, reset } = props;

	const name = error?.name || 'Unspecified error';
	const message = error?.message || error || 'No message provided';

	useEffect(() => {
		console.log('An error occured');
		console.error(error);
	}, [error]);

	return (
		<div className={styles.error}>
			<h3>Whoops, something happened.</h3>
			<pre><b>{name}</b>: {message}</pre>

			<Button onClick={reset}>
				Try again
			</Button>
			<Button onClick={() => location.reload()}>
				Reload page
			</Button>
		</div>
	);
};
