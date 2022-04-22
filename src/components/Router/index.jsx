import { h, Fragment, createContext, isValidElement } from 'preact';
import { useState, useCallback, useContext, useLayoutEffect, useMemo, useEffect } from 'preact/hooks';
import { createPath, parsePath } from './history';


const NavigatorContext = createContext(null);

const RouteContext = createContext({
	outlet: null,
	params: {},
	pathname: '',
	route: null,
});


export const useNavigatorContext = () => {
	return useContext(NavigatorContext);
};

export const useRouteContext = () => {
	return useContext(RouteContext);
};


export const useLocation = () => {
	const navigator = useNavigatorContext();
	return navigator.location;
};

export const useParams = () => {
	const route = useRouteContext();
	return route.params;
};

export const useHref = (href) => {
	const navigator = useNavigatorContext();
	return navigator.history.createHref(href);
};

export const useResolvedPath = (to) => {
	const route = useRouteContext();
	return resolvePath(to, route.pathname);
};

export const useNavigate = () => {
	const navigator = useNavigatorContext();
	const route = useRouteContext();

	const pathname = route.pathname;
	const history = navigator.history;

	return useCallback((to, opts = {}) => {
		if (typeof to == 'number') {
			return history.go(to);
		}

		const path = resolvePath(to, pathname);
		const mode = opts.replace ? 'replace' : 'push';

		history[mode](path, opts.state);
	}, [history, pathname]);
};

export const useNavigateHandler = (to, options = {}) => {
	const { target, replace, state, onClick } = options;

	const navigate = useNavigate();
	const location = useLocation();
	const path = useResolvedPath(to);

	const handleClick = (event) => {
		if (onClick) {
			onClick(event);
		}

		if (!event.defaultPrevented && isLinkEvent(event, target)) {
			event.preventDefault();

			if (createPath(location) === createPath(path)) {
				return;
			}

			navigate(path, { replace, state });
		}
	};

	return handleClick;
};

export const isLinkEvent = (event, target = event.target.target) => {
	return (
		event.button === 0 &&
		(!target || target == '_self') &&
		!isModifiedEvent(event)
	);
};

const isModifiedEvent = (event) => {
	return event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;
};

export const useRoutes = (routes, basename) => {
	const parent = useRouteContext();
	const location = useLocation();

	const base = basename ? joinPath(parent.pathname, basename) : parent.pathname;


	const matches = useMemo(() => (
		matchRoutes(routes, location, base)
	), [routes, location, base]);

	return matches.reduceRight((outlet, { route, pathname, params }) => (
		<RouteContext.Provider
			children={route.element}
			value={{
				outlet,
				params: { ...parent.params, ...params },
				pathname: joinPath(base, pathname),
				basename,
				route,
			}}
		/>
	), null);
};


export const Router = (props) => {
	const { children, history } = props;

	const [state, setState] = useState({
		action: history.action,
		location: history.location,
	});

	useLayoutEffect(() => (
		history.listen(setState)
	), [history]);

	return (
		<NavigatorContext.Provider value={{ ...state, history }}>
			{children}
		</NavigatorContext.Provider>
	);
};


export const Routes = (props) => {
	const { children, basename } = props;

	const routes = createRoutesFromChildren(children);
	return useRoutes(routes, basename);
}

export const Route = (props) => {
	const { element = <Outlet /> } = props;

	return element;
};

export const Outlet = () => {
	return useRouteContext().outlet;
};

export const Navigate = (props) => {
	const { to, replace, state } = props;

	const navigate = useNavigate();

	useEffect(() => {
		navigate(to, { replace, state })
	});

	return null;
};


const CHILDREN_TO_ROUTES = new WeakMap();
const ROUTES_TO_BRANCHES = new WeakMap();

const createRoutesFromChildren = (children) => {
	if (CHILDREN_TO_ROUTES.has(children)) {
		return CHILDREN_TO_ROUTES.get(children);
	}

	const routes = [];

	for (const child of children) {
		if (!isValidElement(child)) {
			continue;
		}

		if (child.type === Fragment) {
			routes.push(...createRoutesFromChildren(child.props.children));
			continue;
		}

		const route = {
			path: child.props.path,
			caseSensitive: !!child.props.caseSensitive,
			element: child.props.element,
		};

		if (child.props.children) {
			const childRoutes = createRoutesFromChildren(child.props.children);

			if (childRoutes.length) {
				route.children = childRoutes;
			}
		}

		routes.push(route);
	}

	CHILDREN_TO_ROUTES.set(children, routes);
	return routes;
};


const matchRoutes = (routes, location, basename) => {
	let pathname = location.pathname || '/';
	let matches = [];

	if (basename) {
		const base = basename.replace(/^\/*/, '/').replace(/\/+$/, '');

		if (pathname.startsWith(base)) {
			pathname = pathname === base ? '/' : pathname.slice(base.length);
		}
		else {
			return matches;
		}
	}

	let branches = ROUTES_TO_BRANCHES.get(routes);

	if (!branches) {
		branches = flattenRoutes(routes);
		rankRouteBranches(branches);

		ROUTES_TO_BRANCHES.set(routes, branches);
	}

	for (const branch of branches) {
		matches = matchRouteBranch(branch, pathname);

		if (matches.length) {
			break;
		}
	}

	return matches;
};

const matchRouteBranch = (branch, pathname) => {
	const [, routes] = branch;

	const matches = [];

	let matchedPathname = '/';
	let matchedParams = {};
	let length = routes.length;

	for (let idx = 0; idx < length; idx++) {
		const route = routes[idx];

		if (route.path) {
			const remaining = matchedPathname !== '/'
				? pathname.slice(matchedPathname.length) || '/'
				: pathname;

			const casing = route.caseSensitive;
			const end = idx === length - 1;

			const matcher = route._match ||= compilePath(route.path, end, casing);
			const match = remaining.match(matcher);

			if (!match) {
				return [];
			}

			matchedPathname = joinPath(matchedPathname, match[1]);
			matchedParams = { ...matchedParams, ...(match.groups || null) };
		}

		matches.push({ route, pathname: matchedPathname, params: matchedParams });
	}

	return matches;
};

const flattenRoutes = (
	routes,
	branches = [],
	parentPath = '',
	parentRoutes = [],
	parentIndexes = []
) => {
	for (const route of routes) {
		const path = joinPath(parentPath, route.path);
		const routes = parentRoutes.concat(route);
		const indexes = parentIndexes.concat([]);

		if (route.children) {
			flattenRoutes(route.children, branches, path, routes, indexes);
		}

		if (route.path) {
			branches.push([path, routes, indexes]);
		}
	}

	return branches;
};

const rankRouteBranches = (branches) => {
	const paramRE = /^:\w+$/;

	const pathScores = {};

	for (const [path] of branches) {
		const segments = path.split('/');

		let score = segments.length;

		for (const segment of segments) {
			if (segment === '*') {
				score -= 2;
			}
			else if (paramRE.test(segment)) {
				score += 2;
			}
			else if (segment === '') {
				score += 1;
			}
			else {
				score += 10;
			}
		}

		pathScores[path] = score;
	}

	branches.sort((a, b) => {
		const [pathA] = a;
		const [pathB] = b;

		const scoreA = pathScores[pathA];
		const scoreB = pathScores[pathB];

		return scoreB - scoreA;
	});
};


export const trimPathTrailing = (path) => {
	return path.replace(/\/+$/, '');
};

export const normalizePath = (path) => {
	return path.replace(/\/\/+/g, '/');
};

export const splitPath = (path) => {
	return normalizePath(path).split('/');
};

export const joinPath = (...paths) => {
	return normalizePath(paths.join('/'));
};

export const normalizeTopic = (str, topic) => {
	return !str || str === topic ? '' : str[0] === topic ? str : topic + str;
};

export const resolvePath = (to, fromPathname = '/', basename = '') => {
  const {
		pathname: toPathname,
		search = '',
		hash = '',
	} = typeof to === 'string' ? parsePath(to) : to;

  const pathname = toPathname
    ? resolvePathname(
        toPathname,
        toPathname[0] === '/'
          ? basename
            ? normalizePath(`/${basename}`)
            : "/"
          : fromPathname
      )
    : fromPathname;

  return {
    pathname,
    search: normalizeTopic(search, '?'),
    hash: normalizeTopic(hash, '#'),
  };
};

export const resolvePathname = (to, from) => {
	const segments = splitPath(trimPathTrailing(from));
	const relative = splitPath(to);

	for (const segment of relative) {
		if (segment === '..') {
			if (segments.length > 1) {
				segments.pop();
			}
		}
		else if (segment !== '.') {
			segments.push(segment);
		}
	}

	return segments.length > 1 ? joinPath(...segments) : '/';
};


export const compilePath = (path, end, caseSensitive) => {
	const source = path
		.replace(/^\/*/, '/')
		.replace(/\/?\*?$/, '')
		.replace(/[\\.*+^$?{}|()[\]]/g, '\\$&')
		.replace(/:(\w+)/g, '(?<$1>[^\/]+)');

	let re = '^(' + source + ')';
	const flags = caseSensitive ? undefined : 'i';

	if (path.at(-1) === '*') {
		if (path.at(-2) === '/') {
			re += '(?:\\/(?<$>.+)|\\/?)';
		} else {
			re += '(?<$>.*)';
		}
	}
	else if (end) {
		re += '\\/?$';
	}

	return new RegExp(re, flags);
};
