import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBooking } from '../../services/apiBookings';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

type MutationParam = {
    id: number;
    breakfast: {
        hasBreakfast?: true;
        extrasPrice?: number;
        totalPrice?: number;
    };
};

export function useCheckIn() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { mutate: checkIn, isPending: isCheckingIn } = useMutation({
        mutationFn: ({ id, breakfast }: MutationParam) =>
            updateBooking(id, {
                status: 'checked-in',
                isPaid: true,
                ...breakfast,
            }),
        onSuccess: (data) => {
            toast.success(`Booking #${data.id} successfully checked in`);
            queryClient.invalidateQueries({ refetchType: 'active' });
            navigate('/');
        },
        onError: () => toast.error('There was an error while checking in'),
    });

    return { checkIn, isCheckingIn };
}
