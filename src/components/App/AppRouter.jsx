import { h } from 'preact';
import { lazy } from 'preact/compat';
import { Routes, Route } from '~/components/Router';


const MainLayout = lazy(() => import('~/layouts/MainLayout'));

const NotFound = lazy(() => import('~/pages/NotFound'));
const Login = lazy(() => import('~/pages/Login'));
const PostsListing = lazy(() => import('~/pages/PostsListing'));
const PostDetails = lazy(() => import('~/pages/PostDetails'));
const PostRandom = lazy(() => import('~/pages/PostRandom'));


const routes = (
	<Routes>
		<Route element={<MainLayout attr='MainLayout' />}>
			<Route path='/' element={<PostsListing attr='PostsListing' />} />
			<Route path='posts' element={<PostsListing attr='PostsListing' />} />
			<Route path='posts/:id' element={<PostDetails attr='PostDetails' />} />
			<Route path='posts/random' element={<PostRandom attr='PostRandom' />} />
			<Route path='*' element={<NotFound attr='NotFound' />} />
		</Route>

		<Route path='login' element={<Login attr='Login' />} />
	</Routes>
);

export const AppRouter = () => {
	return routes;
};
