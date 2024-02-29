import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { subDays } from 'date-fns';
import { getStaysAfterDate } from '../../services/apiBookings';

export function useRecentStays() {
    const [searchParams] = useSearchParams();

    const numDays = Number(searchParams.get('last')) || 7;

    const queryDate = subDays(new Date(), numDays);

    const { data: stays, isPending } = useQuery({
        queryKey: ['stays', `last-${numDays}`],
        queryFn: () => getStaysAfterDate(queryDate.toISOString()),
    });

    const confirmedStays = stays?.filter(
        (stay) => stay.status === 'checked-in' || stay.status === 'checked-out'
    );

    return { stays, confirmedStays, isPending, numDays };
}
