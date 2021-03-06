import { h, Fragment } from 'preact';
import { useMemo } from 'preact/hooks';
import { Suspense } from 'preact/compat';
import { useStore } from '~/lib/global-store';

import { Outlet, useNavigate, useLocation } from '~/components/Router';
import { Link } from '~/components/Link';
import { Button } from '~/components/Button';
import { Menu, MenuItem, MenuTrigger } from '~/components/Menu';
import { FlexSpacer } from '~/components/FlexSpacer';
import { Divider } from '~/components/Divider';
import { Icon } from '~/components/Icon';
import { SearchInput } from '~/components/TagSearch';
import { CircularProgress } from '~/components/CircularProgress';
import * as styles from './MainLayout.css';

import ArchiveIcon from '~/icons/archive.svg';
import MenuIcon from '~/icons/menu.svg';

import { useSearchParams } from '~/utils/useSearchParams.js';
import { useDerivedState } from '~/utils/useDerivedState.js';
import { qss } from '~/utils/qss.js';

import { AuthStore, logout, STATUS_LOGGED_OUT, STATUS_LOGGED_IN } from '~/globals/auth';


// <NewLayout />
const MainLayout = () => {
	return (
		<div className={styles.container}>
			<Header />
			<Suspense fallback={<OutletFallback />}>
				<Outlet />
			</Suspense>
		</div>
	);
};

export default MainLayout;


const OutletFallback = () => {
	return (
		<div className={styles.fallback}>
			<CircularProgress />
		</div>
	);
};

// <Header />
const Header = () => {
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
};

// <HeaderSearch />
const DEFAULT_SEARCH_PARAMS = {
	query: '',
};

const HeaderSearch = () => {
	const navigate = useNavigate();
	const { tags: query } = useSearchParams(DEFAULT_SEARCH_PARAMS);

	const [input, handleInputChange] = useDerivedState(query);

	const handleSearch = () => {
		navigate('/posts?' + qss({ tags: input }));
		window.scrollTo({ top: 0 });
	};


	return (
		<SearchInput
			className={styles.search}
			value={input}
			onChange={handleInputChange}
			onSearch={handleSearch}
		/>
	)
};

// <HeaderDesktopOnly />
const HeaderDesktopOnly = () => {
	const auth = useStore(AuthStore);


	return (
		<div className={styles.desktop}>
			<NavLink to={'/posts?' + qss({ tags: 'order:rank ' })}>
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
						<MenuLink to={'/posts?' + qss({ tags: `ordfav:${auth.profile.name} `})}>
							My Favorites
						</MenuLink>

						<Divider orientation='horizontal' gap />

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
};

// <HeaderMobileOnly />
const HeaderMobileOnly = () => {
	const auth = useStore(AuthStore);

	return (
		<div className={styles.mobile}>
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
							<MenuLink to={'/?' + qss({ tags: `ordfav:${auth.profile.name} `})}>
								My Favorites
							</MenuLink>
							<Divider orientation='horizontal' gap />
						</>
					)}

					<MenuLink to={'/?' + qss({ tags: 'order:rank ' })}>
						Hot
					</MenuLink>
					<MenuLink to='/posts/random'>
						Random
					</MenuLink>

					{auth.status === STATUS_LOGGED_IN && (
						<>
							<Divider orientation='horizontal' gap />
							<MenuItem onClick={logout}>
								Logout
							</MenuItem>
						</>
					)}

					{auth.status === STATUS_LOGGED_OUT && (
						<>
							<Divider orientation='horizontal' gap />
							<LinkTo as={MenuLink} to='/login'>
								Login
							</LinkTo>
						</>
					)}
				</Menu>
			</MenuTrigger>
		</div>
	);
};

// <NavLink />
const NavLink = (props) => {
	return (
		<Button as={Link} variant='ghost' {...props} />
	);
};

// <MenuLink />
const MenuLink = (props) => {
	return (
		<MenuItem as={Link} {...props} />
	);
};

// <LinkTo />
const LinkTo = (props) => {
	const { as, to, ...rest } = props;

	const location = useLocation();

	const params = useMemo(() => (
		qss({ to: location.pathname + location.search })
	), [location]);


	return h(as, { to: to + '?' + params, ...rest });
};
