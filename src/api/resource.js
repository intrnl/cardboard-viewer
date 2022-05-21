import { useQuery } from '~/lib/rq';

import { getTag } from '~/api/assets';

import { createResource } from '~/utils/resource';


export const createTagResource = (name, suspense) => {
	return createResource(() => {
		const { data } = useQuery({
			key: ['tag', name],
			fetch: getTag,
			staleTime: 60000,
			suspense,
		});

		return data;
	});
};
