import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { useNavigate } from 'react-router-dom';

import { logout } from '~/src/globals/auth';


export default function Logout () {
	const navigate = useNavigate();

	useEffect(() => {
		logout();
		navigate('/', { replace: true });
	}, [])

	return (
		<div>Logging out, please wait.</div>
	)
}