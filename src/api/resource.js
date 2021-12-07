import { useQuery } from '@intrnl/rq';

import { getTag } from '~/api/assets';

import { createResource } from '~/utils/resource';


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
