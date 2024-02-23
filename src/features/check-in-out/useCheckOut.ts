import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBooking } from '../../services/apiBookings';
import toast from 'react-hot-toast';

export function useCheckOut() {
    const queryClient = useQueryClient();

    const { mutate: checkOut, isPending: isCheckingOut } = useMutation({
        mutationFn: (id: number) =>
            updateBooking(id, {
                status: 'checked-out',
            }),
        onSuccess: (data) => {
            toast.success(`Booking #${data.id} successfully checked out`);
            queryClient.invalidateQueries({ refetchType: 'active' });
        },
        onError: () => toast.error('There was an error while checking in'),
    });

    return { checkOut, isCheckingOut };
}
