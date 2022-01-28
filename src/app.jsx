import { h, render } from 'preact';
import { defaultQueryOptions } from '@intrnl/rq';

import '~/styles/reset.css';
import '~/styles/app.css';
import { App } from '~/components/App';


const CF_COMMIT = process.env.CF_PAGES_COMMIT_SHA;
const CF_BRANCH = process.env.CF_PAGES_BRANCH;

const CF_ANALYTICS_TOKEN = process.env.CF_ANALYTICS_TOKEN;

if (CF_COMMIT && CF_BRANCH) {
	console.debug(`running ${CF_BRANCH}/${CF_COMMIT}`);
}

defaultQueryOptions.errorBoundary = true;

render(<App />, document.getElementById('root'));

if (CF_ANALYTICS_TOKEN) {
	globalThis.__cfBeacon = { token: CF_ANALYTICS_TOKEN };

	const script = document.createElement('script');
	script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
	script.defer = true;

	document.head.append(script);
}
