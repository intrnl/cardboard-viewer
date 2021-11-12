import { h, Fragment } from 'preact';
import { useMemo } from 'preact/hooks';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '~/lib/global-store';

import * as styles from '~/src/styles/layouts/MainLayout.module.css';

import { Icon } from '~/src/components/Icon.jsx';
import { SearchInput } from '~/src/components/TagSearch.jsx';

import SearchIcon from '~/src/icons/search.svg?url';

import { AuthStore, logout, STATUS_VERIFYING, STATUS_LOGGED_IN, STATUS_LOGGED_OUT } from '~/src/globals/auth.js';

import { useSearchParams } from '~/src/utils/useSearchParams.js';
import { useDerivedState } from '~/src/utils/useDerivedState.js';
import { qss } from '~/src/utils/qss.js';


export default function MainLayout () {
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<HeaderBar />
			</div>
			<div className={styles.main}>
				<Outlet />
			</div>
			<div className={styles.aside}>
				<Search />
				<div id='' />
			</div>
		</div>
	)
}


const DEFAULT_SEARCH_PARAMS = {
	query: '',
};

function Search () {
	const navigate = useNavigate();
	const [{ query }] = useSearchParams(DEFAULT_SEARCH_PARAMS);

	const [input, handleInputChange] = useDerivedState(query);

	const handleSubmit = (event) => {
		event.preventDefault();

		let url = '/';

		if (input) {
			url += '?' + qss({ query: input });
		}

		navigate(url);
	};

	return (
		<form onSubmit={handleSubmit} className={styles.search}>
			<SearchInput
				value={input}
				onChange={handleInputChange}
			/>

			<button type='submit' aria-label='Search' className={styles.searchButton}>
				<Icon src={SearchIcon} />
			</button>
		</form>
	)
}


function HeaderBar () {
	const auth = useStore(AuthStore);
	const authStatus = auth.status;

	return (
		<>
			{authStatus === STATUS_VERIFYING && (
				<div>Verifying login</div>
			)}
			{authStatus === STATUS_LOGGED_OUT && (
				<Login />
			)}
			{authStatus === STATUS_LOGGED_IN && (
				<div>
					<span>Logged in as <b>{auth.user}</b></span>
					<Logout />
				</div>
			)}
		</>
	)
}

function Login () {
	const location = useLocation();

	const params = useMemo(() => (
		qss({ to: location.pathname + location.search })
	), [location]);

	return (
		<Link to={`/login?${params}`}>
			Login
		</Link>
	);
}

function Logout () {
	const handleLogout = (event) => {
		event.preventDefault();
		logout();
	};

	return (
		<Link to='/logout' onClick={handleLogout}>
			Logout
		</Link>
	);
}
