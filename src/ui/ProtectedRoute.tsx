import { ReactNode, useEffect } from 'react';
import { useUser } from '../features/authentication/useUser';
import Spinner from './Spinner';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const FullPage = styled.div`
    height: 100vh;
    background-color: var(--color-grey-50);
    display: flex;
    align-items: center;
    justify-content: center;
`;

function ProtectedRoute({ children }: { children: ReactNode }) {
    const navigate = useNavigate();
    //1. Load authenticated user
    const { user, isUserLoading, isAuthenticated } = useUser();

    //2. If there is NO authenticated user, redirect to /login
    useEffect(
        function () {
            if (!isAuthenticated && !isUserLoading) navigate('/login');
        },
        [isAuthenticated, isUserLoading, navigate]
    );

    //3. While loading, show spinner
    if (isUserLoading)
        return (
            <FullPage>
                <Spinner />
            </FullPage>
        );

    // Don't do this: This is essentially updating a component during the render of another component
    // Use useEffect or callbacks instead
    // if (!isAuthenticated) {
    //     navigate('/login');
    // }

    //4. If there is a user, render the app
    if (isAuthenticated) return children;
}

export default ProtectedRoute;
