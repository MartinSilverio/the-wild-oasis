import { FormEvent, MouseEvent, useState } from 'react';
import Button from '../../ui/Button';
import Form from '../../ui/Form';
import Input from '../../ui/Input';
import FormRowVertical from '../../ui/FormRowVertical';
import { useLogin } from './useLogin';
import SpinnerMini from '../../ui/SpinnerMini';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoggingIn } = useLogin();
    const navigate = useNavigate();

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!email || !password) return;
        login(
            { email, password },
            {
                onSettled: () => {
                    setEmail('');
                    setPassword('');
                },
            }
        );
    }

    function handleNavigateToSignUp(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        navigate('/signup');
    }

    return (
        <Form onSubmit={handleSubmit}>
            <FormRowVertical label="Email address">
                <Input
                    type="email"
                    id="email"
                    // This makes this form better for password managers
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoggingIn}
                />
            </FormRowVertical>
            <FormRowVertical label="Password">
                <Input
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoggingIn}
                />
            </FormRowVertical>
            <FormRowVertical>
                <>
                    <Button size="large" disabled={isLoggingIn}>
                        {isLoggingIn ? <SpinnerMini /> : `Login`}
                    </Button>
                    <Button
                        size="large"
                        $variation="secondary"
                        disabled={isLoggingIn}
                        onClick={handleNavigateToSignUp}
                    >
                        Sign Up
                    </Button>
                </>
            </FormRowVertical>
        </Form>
    );
}

export default LoginForm;
