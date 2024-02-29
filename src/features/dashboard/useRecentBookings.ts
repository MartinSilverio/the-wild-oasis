import { useQuery } from '@tanstack/react-query';
import { getBookingsAfterDate } from '../../services/apiBookings';
import { useSearchParams } from 'react-router-dom';
import { subDays } from 'date-fns';

export function useRecentBookings() {
    const [searchParams] = useSearchParams();

    const numDays = Number(searchParams.get('last')) || 7;

    const queryDate = subDays(new Date(), numDays);

    const { data: bookings, isPending } = useQuery({
        queryKey: ['bookings', `last-${numDays}`],
        queryFn: () => getBookingsAfterDate(queryDate.toISOString()),
    });

    return { bookings, isPending, numDays };
}
