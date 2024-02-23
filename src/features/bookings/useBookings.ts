import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AllowableQueryMethods, getBookings } from '../../services/apiBookings';
import { useSearchParams } from 'react-router-dom';
import { LabelValue } from '../../utils/general.types';
import { PAGE_SIZE } from '../../utils/constants';

export function useBookings() {
    const [searchParams] = useSearchParams();
    const queryClient = useQueryClient();

    // filter
    const filterValue = searchParams.get('status');
    const filter:
        | (LabelValue & {
              method: AllowableQueryMethods;
          })
        | null =
        !filterValue || filterValue === 'all'
            ? null
            : {
                  label: 'status',
                  value: filterValue,
                  method: 'eq',
              };

    //sortBy
    const sortByRaw = searchParams.get('sortBy') || 'startDate-desc';
    const [field, direction] = sortByRaw.split('-');
    const sortBy = { field, direction };

    //page
    const page = !searchParams.get('page')
        ? 1
        : Number(searchParams.get('page'));

    const {
        data: { data: bookings, count } = {},
        isPending,
        error,
    } = useQuery({
        queryKey: ['bookings', filter, sortByRaw, page],
        queryFn: () => getBookings({ filter, sortBy, page }),
    });

    if (typeof count === 'number') {
        const pageCount = Math.ceil(count / PAGE_SIZE);
        // PRE-FETCH
        if (page < pageCount) {
            queryClient.prefetchQuery({
                queryKey: ['bookings', filter, sortByRaw, page + 1],
                queryFn: () => getBookings({ filter, sortBy, page: page + 1 }),
            });
        }

        if (page > 1) {
            queryClient.prefetchQuery({
                queryKey: ['bookings', filter, sortByRaw, page - 1],
                queryFn: () => getBookings({ filter, sortBy, page: page - 1 }),
            });
        }
    }

    return { bookings, isPending, error, count };
}
