import { h, Fragment } from 'preact';
import { useMemo } from 'preact/hooks';
import { Suspense } from 'preact/compat';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '~/lib/global-store';

import { Link } from '~/src/components/Link.jsx';
import { Button } from '~/src/components/Button.jsx';
import { Menu, MenuItem } from '~/src/components/Menu.jsx';
import { MenuTrigger } from '~/src/components/MenuTrigger.jsx';
import { FlexSpacer } from '~/src/components/FlexSpacer.jsx';
import { Divider } from '~/src/components/Divider.jsx';
import { Icon } from '~/src/components/Icon.jsx';
import { SearchInput } from '~/src/components/TagSearch.jsx';
import { CircularProgress } from '~/src/components/CircularProgress.jsx';
import * as styles from '~/src/styles/layouts/NewLayout.module.css';

import ArchiveIcon from '~/src/icons/archive.svg';
import MenuIcon from '~/src/icons/menu.svg';

import { useSearchParams } from '~/src/utils/useSearchParams.js';
import { useDerivedState } from '~/src/utils/useDerivedState.js';
import { qss } from '~/src/utils/qss.js';

import { AuthStore, logout, STATUS_LOGGED_OUT, STATUS_LOGGED_IN } from '~/src/globals/auth';


// <NewLayout />
export default function NewLayout () {
	return (
		<div className={styles.container}>
			<Header />
			<Suspense fallback={<OutletFallback />}>
				<Outlet />
			</Suspense>
		</div>
	);
}

function OutletFallback () {
	return (
		<div className={styles.fallback}>
			<CircularProgress />
		</div>
	);
}

// <Header />
function Header () {
	return (
		<div className={styles.header}>
			<NavLink to='/' title='Home'>
				<Icon src={ArchiveIcon} />
			</NavLink>

			<HeaderSearch />

			<HeaderDesktopOnly />
			<HeaderMobileOnly />
		</div>
	);
}

// <HeaderSearch />
const DEFAULT_SEARCH_PARAMS = {
	query: '',
};

function HeaderSearch () {
	const navigate = useNavigate();
	const [{ query }] = useSearchParams(DEFAULT_SEARCH_PARAMS);

	const [input, handleInputChange] = useDerivedState(query);

	const handleSearch = () => {
		let url = '/';

		if (input) {
			url += '?' + qss({ query: input });
		}

		navigate(url);
		window.scrollTo({ top: 0 });
	};

	return (
		<SearchInput
			className={styles.headerSearch}
			value={input}
			onChange={handleInputChange}
			onSearch={handleSearch}
		/>
	)
}

// <HeaderDesktopOnly />
function HeaderDesktopOnly () {
	const auth = useStore(AuthStore);


	return (
		<div className={styles.navDesktop}>
			<NavLink to={'/?' + qss({ query: 'order:rank ' })}>
				Hot
			</NavLink>
			<NavLink to='/posts/random'>
				Random
			</NavLink>

			<FlexSpacer />

			{auth.status === STATUS_LOGGED_OUT && (
				<LinkTo as={NavLink} to='/login'>
					Login
				</LinkTo>
			)}

			{auth.status === STATUS_LOGGED_IN && (
				<MenuTrigger>
					<Button variant='ghost'>
						{auth.profile.name}
					</Button>

					<Menu>
						<MenuLink to={`/users/${auth.profile.id}`}>
							My Profile
						</MenuLink>
						<MenuLink to={'/?' + qss({ query: `ordfav:${auth.profile.name} `})}>
							My Favorites
						</MenuLink>

						<Divider gap />

						{auth.status === STATUS_LOGGED_IN && (
							<MenuItem onClick={logout}>
								Logout
							</MenuItem>
						)}

						{auth.status === STATUS_LOGGED_OUT && (
							<LinkTo as={MenuLink} to='/login'>
								Login
							</LinkTo>
						)}
					</Menu>
				</MenuTrigger>
			)}
		</div>
	);
}

// <HeaderMobileOnly />
function HeaderMobileOnly () {
	const auth = useStore(AuthStore);

	return (
		<div className={styles.navMobile}>
			<MenuTrigger>
				<Button title='Menu'>
					<Icon src={MenuIcon} />
				</Button>

				<Menu>
					{auth.status === STATUS_LOGGED_IN && (
						<>
							<MenuItem disabled>
								{auth.profile.name}
							</MenuItem>
							<MenuLink to={`/users/${auth.profile.id}`}>
								My Profile
							</MenuLink>
							<MenuLink to={'/?' + qss({ query: `ordfav:${auth.profile.name} `})}>
								My Favorites
							</MenuLink>
							<Divider gap />
						</>
					)}

					<MenuLink to={'/?' + qss({ query: 'order:rank ' })}>
						Hot
					</MenuLink>
					<MenuLink to='/posts/random'>
						Random
					</MenuLink>

					{auth.status === STATUS_LOGGED_IN && (
						<>
							<Divider gap />
							<MenuItem onClick={logout}>
								Logout
							</MenuItem>
						</>
					)}

					{auth.status === STATUS_LOGGED_OUT && (
						<>
							<Divider gap />
							<LinkTo as={MenuLink} to='/login'>
								Login
							</LinkTo>
						</>
					)}
				</Menu>
			</MenuTrigger>
		</div>
	);
}

// <NavLink />
function NavLink (props) {
	return (
		<Button as={Link} variant='ghost' {...props} />
	);
}

// <MenuLink />
function MenuLink (props) {
	return (
		<MenuItem as={Link} {...props} />
	);
}

// <LinkTo />
function LinkTo (props) {
	const { as, to, ...rest } = props;

	const location = useLocation();

	const params = useMemo(() => (
		qss({ to: location.pathname + location.search })
	), [location]);


	return h(as, { to: to + '?' + params, ...rest });
}
