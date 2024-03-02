import styled from 'styled-components';
import Logo from '../ui/Logo';
import Heading from '../ui/Heading';
import SignUpForm from '../features/authentication/SignUpForm';

const SignUpLayout = styled.main`
    min-height: 100vh;
    display: grid;
    grid-template-columns: 90rem;
    align-content: center;
    justify-content: center;
    gap: 3.2rem;
    background-color: var(--color-grey-50);
`;

function SignUp() {
    return (
        <SignUpLayout>
            <Logo />
            <Heading as="h4">Sign Up</Heading>
            <SignUpForm />
        </SignUpLayout>
    );
}

export default SignUp;
