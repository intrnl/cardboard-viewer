import { useRef } from 'preact/hooks';
import { Suspense } from 'preact/compat';


export function Freeze (props) {
	let { freeze, children, fallback = null } = props;

	return (
		<Suspense fallback={fallback}>
			<Suspender freeze={freeze} children={children} />
		</Suspense>
	)
}

function Suspender (props) {
	let { freeze, children } = props;

	let ref = useRef();

	if (freeze) {
		throw ref.current ||= new Promise((resolve) => ref.resolve = resolve);
	}

	if (ref.current) {
		ref.resolve();
		ref.current = null;
	}

	return children;
}
