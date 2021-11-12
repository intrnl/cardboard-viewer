import { h } from 'preact';
import { lazy } from 'preact/compat';
import { Routes, Route } from 'react-router-dom';


const Login = lazy(() => import('~/src/pages/Login.jsx'));
const PostsListing = lazy(() => import('~/src/pages/PostsListing.jsx'));
const PostDetails = lazy(() => import('~/src/pages/PostDetails.jsx'));


export function AppRouter () {
	return (
		<Routes>
			<Route path='/' element={<PostsListing />} />
			<Route path='/posts/:id' element={<PostDetails />} />
			<Route path='/login' element={<Login />} />
		</Routes>
	);
}
