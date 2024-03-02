import { useMutation } from '@tanstack/react-query';
import { signUp as signUpApi } from '../../services/apiAuth';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

export function useSignUp() {
    const { pathname } = useLocation();

    const { mutate: signUp, isPending: isSigningUp } = useMutation({
        mutationFn: signUpApi,
        onSuccess: () => {
            if (pathname !== '/signup') {
                toast.success(
                    "Account successfully created! Please verify the new account from the user's email address"
                );
            }
        },
    });

    return { signUp, isSigningUp };
}
