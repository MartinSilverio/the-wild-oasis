import styled from 'styled-components';

import Heading from '../ui/Heading';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

const StyledSignUpSuccess = styled.main`
    height: 100vh;
    background-color: var(--color-grey-50);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4.8rem;
`;

const Box = styled.div`
    /* box */
    background-color: var(--color-grey-0);
    border: 1px solid var(--color-grey-100);
    border-radius: var(--border-radius-md);

    padding: 4.8rem;
    flex: 0 1 96rem;
    text-align: center;

    & h3 {
        margin-bottom: 3.2rem;
    }
`;

function SignUpSuccess() {
    const navigate = useNavigate();

    return (
        <StyledSignUpSuccess>
            <Box>
                <Heading as="h3">
                    Successfully signed up! Please check your email to confirm
                    you account.
                </Heading>
                <Button onClick={() => navigate('/login')} size="large">
                    Go to Login
                </Button>
            </Box>
        </StyledSignUpSuccess>
    );
}

export default SignUpSuccess;
