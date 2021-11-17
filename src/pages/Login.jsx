import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { useNavigate } from 'react-router-dom';

import * as styles from '~/src/styles/pages/Login.module.css';

import { login } from '~/src/globals/auth.js';

import { useSearchParams } from '~/src/utils/useSearchParams.js';
import { useInputState } from '~/src/utils/useInputState.js';


const DEFAULT_SEARCH_PARAMS = {
	to: '/',
};

export default function LoginPage () {
	const navigate = useNavigate();
	const [{ to }] = useSearchParams(DEFAULT_SEARCH_PARAMS);

	const [dispatching, setDispatching] = useState(false);
	const [error, setError] = useState();

	const [key, handleKeyInput] = useInputState('');
	const [user, handleUserInput] = useInputState('');

	const [tokenUrl, handleTokenUrlInput] = useInputState('');

	const submit = async (event) => {
		event?.preventDefault();

		setDispatching(true);

		login({ key, user }).then(
			() => {
				navigate(to, { replace: true });
			},
			(error) => {
				setError(error);
				setDispatching(false);
			},
		);
	};

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
		<div className={styles.container}>
			<form onSubmit={submit} className={styles.loginForm}>
				{error && (
					<fieldset>
						<legend>Login failed</legend>
						<p>{error?.message || error}</p>
					</fieldset>
				)}

				<fieldset disabled={dispatching}>
					<legend>Quick login</legend>

					<p>Copy-paste the example usage URL during API key creation.</p>

					<label>
						Token URL

						<input
							type='url'
							value={tokenUrl}
							onChange={handleTokenUrlInput}
						/>
					</label>
				</fieldset>

				<fieldset disabled={dispatching}>
					<legend>Login information</legend>

					<label>
						User

						<input
							required
							autocomplete='username'
							value={user}
							onChange={handleUserInput}
						/>
					</label>

					<label>
						API key

						<input
							required
							type='password'
							value={key}
							onChange={handleKeyInput}
						/>
					</label>
				</fieldset>

				<div>
					<button disabled={dispatching} type='submit'>
						Login
					</button>
				</div>
			</form>
		</div>
	);
}
