import { useQuery } from '@intrnl/rq';

import { getTag } from '~/api/assets.new';

import { createResource } from '~/lib/use-asset';


export function createTagResource (name) {
	return createResource(() => {
		const { data } = useQuery({
			key: ['tag', name],
			fetch: getTag,
			staleTime: 60000,
			suspense: true,
		});

		return data;
	});
}
