import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '../../services/apiAuth';

export function useUser() {
    const { isPending: isUserLoading, data: user } = useQuery({
        queryKey: ['user'],
        queryFn: getCurrentUser,
    });

    return {
        isUserLoading,
        user,
        isAuthenticated: user?.role === 'authenticated',
    };
}
