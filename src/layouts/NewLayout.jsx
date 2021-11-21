import { h, Fragment, cloneElement } from 'preact';
import { useLayoutEffect, useMemo, useRef } from 'preact/hooks';
import { Suspense } from 'preact/compat';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '~/lib/global-store';

import clsx from 'clsx';
import { Link } from '~/src/components/Link.jsx';
import { Button } from '~/src/components/Button.jsx';
import { Menu, MenuItem } from '~/src/components/Menu.jsx';
import { FlexSpacer } from '~/src/components/FlexSpacer.jsx';
import { Divider } from '~/src/components/Divider.jsx';
import { Icon } from '~/src/components/Icon.jsx';
import { SearchInput } from '~/src/components/TagSearch.jsx';
import * as styles from '~/src/styles/layouts/NewLayout.module.css';

import ArchiveIcon from '~/src/icons/archive.svg';
import MenuIcon from '~/src/icons/menu.svg';

import { useSearchParams } from '~/src/utils/useSearchParams.js';
import { useDerivedState } from '~/src/utils/useDerivedState.js';
import { qss } from '~/src/utils/qss.js';
import { getNextSibling, getPreviousSibling } from '~/src/utils/element.js';

import { AuthStore, logout, STATUS_LOGGED_OUT, STATUS_LOGGED_IN } from '~/src/globals/auth';


// <NewLayout />
export default function NewLayout () {
	return (
		<div className={styles.container}>
			<Header />
			<Suspense fallback={<div>Loading page</div>}>
				<Outlet />
			</Suspense>
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
				<NavMenu>
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
				</NavMenu>
			)}
		</div>
	);
}

// <HeaderMobileOnly />
function HeaderMobileOnly () {
	const auth = useStore(AuthStore);

	return (
		<div className={styles.navMobile}>
			<NavMenu>
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
			</NavMenu>
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

// <NavMenu />
const focusableItem = `a, button:not(:disabled)`;
const focusableHeader = `:scope > :is(${focusableItem}, summary)`;

function NavMenu (props) {
	const { className, children } = props;

	const containerRef = useRef();
	const menuRef = useRef();

	const toggleOpen = (value) => {
		const container = containerRef.current;

		if (container) {
			container.open = value?.target ? !container.open : !!value;
		}
	};

	const handleToggle = () => {
		const container = containerRef.current;
		const menu = menuRef.current;

		const target = container.open ? menu : container;

		const focusable = target.querySelector(focusableHeader);
		(focusable || target).focus();

		target.scrollIntoView({ block: 'nearest' });
	};

	const handleKeyDown = (event) => {
		const menu = menuRef.current;

		const item = event.target;
		const keyCode = event.keyCode;

		if (item !== menu && item.parentElement !== menu) {
			return;
		}

		if (keyCode === 27) {
			toggleOpen();
		}
		else if (keyCode === 38) {
			const focusable = (
				getPreviousSibling(item, focusableItem) ||
				getPreviousSibling(menu.lastElementChild, focusableItem, true)
			);

			focusable?.focus();
		}
		else if (keyCode === 40) {
			const focusable = (
				getNextSibling(item, focusableItem) ||
				getNextSibling(menu.firstElementChild, focusableItem, true)
			);

			focusable?.focus();
		}
	};

	const handleMenuClick = (event) => {
		const target = event.target;

		if (target.matches(focusableItem)) {
			toggleOpen(false);
		}
	};

	useLayoutEffect(() => {
		const container = containerRef.current;

		const handleDocumentClick = (event) => {
			if (container.open && !container.contains(event.target)) {
				toggleOpen();
			}
		};

		document.addEventListener('click', handleDocumentClick);
		return () => document.removeEventListener('click', handleDocumentClick);
	}, []);


	const cn = clsx(styles.navContainer, className);

	const button = children[0];
	const menu = children[1];


	return (
		<details ref={containerRef} className={cn} onToggle={handleToggle}>
			{cloneElement(button, {
				as: 'summary',
				role: 'button',
				'aria-haspopup': 'menu',
			})}

			{cloneElement(menu, {
				ref: menuRef,
				role: 'menu',
				className: styles.navMenu,
				onClick: handleMenuClick,
				onKeyDown: handleKeyDown,
			})}
		</details>
	);
}
