import { useQuery } from '@tanstack/react-query';
import { getBooking } from '../../services/apiBookings';
import { useParams } from 'react-router-dom';

export function useBooking() {
    const { bookingId } = useParams();

    const {
        data: booking,
        isPending,
        error,
    } = useQuery({
        queryKey: ['booking', Number(bookingId)],
        queryFn: () => getBooking(Number(bookingId)),
        retry: false,
    });

    return { booking, isPending, error };
}
