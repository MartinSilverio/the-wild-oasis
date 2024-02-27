import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LoginObject, login as loginApi } from '../../services/apiAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function useLogin() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { mutate: login, isPending: isLoggingIn } = useMutation({
        mutationFn: (login: LoginObject) => loginApi(login),
        onSuccess: (user) => {
            console.log(user);
            queryClient.setQueryData(['user'], user.user);
            navigate('/', { replace: true });
        },
        onError: (err) => {
            console.log('ERROR', err);
            toast.error('Provided email or password are incorrect');
        },
    });

    return { login, isLoggingIn };
}
