import { h } from 'preact';
import { lazy } from 'preact/compat';
import { Routes, Route } from 'react-router-dom';


const NewLayout = lazy(() => import('~/src/layouts/NewLayout.jsx'));

const Login = lazy(() => import('~/src/pages/Login.jsx'));
const PostsListing = lazy(() => import('~/src/pages/PostsListing.jsx'));
const PostDetails = lazy(() => import('~/src/pages/PostDetails.jsx'));
const PostRandom = lazy(() => import('~/src/pages/PostRandom.jsx'));


export function AppRouter () {
	return (
		<Routes>
			<Route element={<NewLayout />}>
				<Route path='/' element={<PostsListing />} />
				<Route path='/posts/:id' element={<PostDetails />} />
				<Route path='/posts/random' element={<PostRandom />} />
			</Route>

			<Route path='/login' element={<Login />} />
		</Routes>
	);
}
