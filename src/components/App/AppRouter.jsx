import { h } from 'preact';
import { lazy } from 'preact/compat';
import { Routes, Route } from 'react-router-dom';


const MainLayout = lazy(() => import('~/layouts/MainLayout'));

const Login = lazy(() => import('~/pages/Login'));
const PostsListing = lazy(() => import('~/pages/PostsListing'));
const PostDetails = lazy(() => import('~/pages/PostDetails'));
const PostRandom = lazy(() => import('~/pages/PostRandom'));


export function AppRouter () {
	return (
		<Routes>
			<Route element={<MainLayout />}>
				<Route path='/' element={<PostsListing />} />
				<Route path='/posts/:id' element={<PostDetails />} />
				<Route path='/posts/random' element={<PostRandom />} />
			</Route>

			<Route path='/login' element={<Login />} />
		</Routes>
	);
}
