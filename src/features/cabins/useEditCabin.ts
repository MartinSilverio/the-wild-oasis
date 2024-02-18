import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateEditCabinData, createEditCabin } from '../../services/apiCabins';
import toast from 'react-hot-toast';

export function useEditCabin() {
    const queryClient = useQueryClient();
    const { mutate: editCabin, isPending: isEditing } = useMutation({
        mutationFn: ({
            newCabinData,
            id,
        }: {
            newCabinData: CreateEditCabinData;
            id: number;
        }) => createEditCabin(newCabinData, id),
        onSuccess: () => {
            toast.success('Cabin successfully edited');
            queryClient.invalidateQueries({ queryKey: ['cabins'] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { editCabin, isEditing };
}
