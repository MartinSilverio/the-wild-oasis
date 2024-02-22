import { useQuery } from '@tanstack/react-query';
import { AllowableQueryMethods, getBookings } from '../../services/apiBookings';
import { useSearchParams } from 'react-router-dom';
import { LabelValue } from '../../utils/general.types';

export function useBookings() {
    const [searchParams] = useSearchParams();

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

    const sortByRaw = searchParams.get('sortBy') || 'startDate-desc';
    const [field, direction] = sortByRaw.split('-');
    const sortBy = { field, direction };

    const {
        data: bookings,
        isPending,
        error,
    } = useQuery({
        queryKey: ['bookings', filter, sortByRaw],
        queryFn: () => getBookings({ filter, sortBy }),
    });

    return { bookings, isPending, error };
}
