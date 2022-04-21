import { h } from 'preact';

import { Button } from '~/components/Button';
import { Link } from '~/components/Link';
import * as styles from './NotFound.css';


const NotFoundPage = () => {
	return (
		<div className={styles.container}>
			<h3>Uh oh, seems like we're lost.</h3>
			<p>
				The link you followed might be broken, removed, or you don't have the
				permissions to view the content.
			</p>

			<Button as={Link} to='/'>
				Go home
			</Button>
		</div>
	);
};

export default NotFoundPage;
