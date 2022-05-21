import { h, render } from '@intrnl/freak';
import { defaultQueryOptions } from '~/lib/rq';

import '~/styles/reset.css';
import '~/styles/app.css';
import { App } from '~/components/App';


const CF_COMMIT = process.env.CF_PAGES_COMMIT_SHA;
const CF_BRANCH = process.env.CF_PAGES_BRANCH;

if (CF_COMMIT && CF_BRANCH) {
	console.debug(`running ${CF_BRANCH}/${CF_COMMIT}`);
}

defaultQueryOptions.errorBoundary = true;

render(<App />, document.getElementById('root'));
