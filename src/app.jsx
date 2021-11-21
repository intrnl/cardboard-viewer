import { h, render } from 'preact';
// import 'preact/devtools';
// import 'preact/debug';

import '~/src/styles/reset.css';
import '~/src/styles/app.css';
import { App } from '~/src/components/App.jsx';


const CF_COMMIT = process.env.CF_PAGES_COMMIT_SHA;
const CF_BRANCH = process.env.CF_PAGES_BRANCH;

if (CF_COMMIT && CF_BRANCH) {
	console.debug(`running ${CF_BRANCH}/${CF_COMMIT}`);
}

render(<App />, document.getElementById('root'));
