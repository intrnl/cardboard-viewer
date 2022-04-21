import { h } from 'preact';
import { useEffect, useLayoutEffect } from 'preact/hooks';
import { useStore } from '~/lib/global-store';

import { useNavigate } from '~/components/Router';
import { Card } from '~/components/Card';
import { FieldLabel } from '~/components/FieldLabel';
import { TextField } from '~/components/TextField';
import { Button } from '~/components/Button';
import * as styles from './Login.css';

import { AuthStore, login, STATUS_LOGGED_IN, STATUS_VERIFYING } from '~/globals/auth.js';

import { useSearchParams } from '~/utils/useSearchParams.js';
import { useInputState } from '~/utils/useInputState.js';


const DEFAULT_SEARCH_PARAMS = {
	to: '/',
};

const LoginPage = () => {
	const auth = useStore(AuthStore);
	const navigate = useNavigate();
	const { to } = useSearchParams(DEFAULT_SEARCH_PARAMS);

	const dispatching = auth.status === STATUS_VERIFYING;

	const [tokenUrl, handleTokenUrlInput] = useInputState('');

	const [user, handleUserInput] = useInputState('');
	const [key, handleKeyInput] = useInputState('');

	const handleSubmit = (event) => {
		event.preventDefault();

		login({ user, key }).catch(
			(error) => {
				console.error('Failed to login', error);
			},
		);
	};

	useLayoutEffect(() => {
		if (auth.status === STATUS_LOGGED_IN) {
			navigate(to, { replace: true });
		}
	}, [auth.status]);

	useEffect(() => {
		if (!tokenUrl) {
			return;
		}

		try {
			const parsed = new URL(tokenUrl);

			const params = parsed.searchParams;
			const api_key = params.get('api_key');
			const login = params.get('login');

			if (!api_key || !login) {
				return;
			}

			handleKeyInput(api_key);
			handleUserInput(login);
			handleTokenUrlInput('');
		}
		catch {}
	}, [tokenUrl]);


	return (
		<form className={styles.container} onSubmit={handleSubmit}>
			<Card as='fieldset' disabled={dispatching} className={styles.card}>
				<FieldLabel>
					User
					<TextField
						required
						autocomplete='username'
						value={user}
						onChange={handleUserInput}
					/>
				</FieldLabel>

				<FieldLabel>
					API Key
					<TextField
						required
						type='password'
						value={key}
						onChange={handleKeyInput}
					/>
				</FieldLabel>

				<Button type='submit' variant='primary'>
					Login
				</Button>
			</Card>

			<Card as='fieldset' disabled={dispatching} className={styles.card}>
				<FieldLabel>
					Token URL
					<TextField
						type='url'
						placeholder='https://danbooru.donmai.us/profile.json?...'
						value={tokenUrl}
						onChange={handleTokenUrlInput}
					/>
					<p className={styles.blurb}>
						Quickly login by copy-pasting the example usage URL provided after
						API key creation.
					</p>
				</FieldLabel>
			</Card>
		</form>
	);
};

export default LoginPage;
