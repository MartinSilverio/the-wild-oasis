import { useForm } from 'react-hook-form';
import Button from '../../ui/Button';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import { useSignUp } from './useSignUp';
import { useLocation, useNavigate } from 'react-router-dom';
import { MouseEvent } from 'react';
import FormRowVertical from '../../ui/FormRowVertical';

// Email regex: /\S+@\S+\.\S+/

interface TLoginForm {
    fullName: string;
    email: string;
    password: string;
    passwordConfirm: string;
}

function SignUpForm() {
    const { register, formState, getValues, handleSubmit, reset } =
        useForm<TLoginForm>();
    const { signUp, isSigningUp } = useSignUp();
    const { errors } = formState;
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const atSignUp = pathname === '/signup';
    const signUpColumns = atSignUp ? '24rem 1fr .5fr' : undefined;

    function onSubmit({ fullName, email, password }: TLoginForm) {
        signUp(
            {
                fullName,
                email,
                password,
            },
            {
                onSuccess: () => {
                    if (atSignUp) {
                        navigate('/signup_success');
                    }
                },
                onSettled: () => reset(),
            }
        );
    }

    function handleBackToLogin(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        navigate('/login');
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <FormRow
                label="Full name"
                error={errors.fullName?.message}
                columns={signUpColumns}
            >
                <Input
                    type="text"
                    id="fullName"
                    {...register('fullName', {
                        required: 'This field is required',
                    })}
                    disabled={isSigningUp}
                />
            </FormRow>

            <FormRow
                label="Email address"
                error={errors.email?.message}
                columns={signUpColumns}
            >
                <Input
                    type="email"
                    id="email"
                    {...register('email', {
                        required: 'This field is required',
                        pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: 'Please provide a valid email address',
                        },
                    })}
                    disabled={isSigningUp}
                />
            </FormRow>

            <FormRow
                label="Password (min 8 characters)"
                error={errors.password?.message}
                columns={signUpColumns}
            >
                <Input
                    type="password"
                    id="password"
                    {...register('password', {
                        required: 'This field is required',
                        minLength: {
                            value: 8,
                            message: 'Password needs a minimum of 8 characters',
                        },
                    })}
                    disabled={isSigningUp}
                />
            </FormRow>

            <FormRow
                label="Repeat password"
                error={errors.passwordConfirm?.message}
                columns={signUpColumns}
            >
                <Input
                    type="password"
                    id="passwordConfirm"
                    {...register('passwordConfirm', {
                        required: 'This field is required',
                        validate: (value) =>
                            value === getValues().password ||
                            'Passwords need to match',
                    })}
                    disabled={isSigningUp}
                />
            </FormRow>

            {atSignUp ? (
                <>
                    <FormRowVertical>
                        <>
                            <Button disabled={isSigningUp}>Sign Up</Button>

                            <Button
                                disabled={isSigningUp}
                                onClick={handleBackToLogin}
                                $variation="secondary"
                            >
                                Back to Login
                            </Button>
                        </>
                    </FormRowVertical>
                    <p>
                        *Note: Since this is supposed to be an app for
                        employees, normally only another employee can register
                        another account. But since this is a demo app, a sign up
                        page was created to see the full app
                    </p>
                </>
            ) : (
                <FormRow>
                    <>
                        {/* type is an HTML attribute! */}
                        <Button
                            $variation="secondary"
                            type="reset"
                            disabled={isSigningUp}
                            onClick={() => reset()}
                        >
                            Cancel
                        </Button>
                        <Button disabled={isSigningUp}>Create new user</Button>
                    </>
                </FormRow>
            )}
        </Form>
    );
}

export default SignUpForm;
