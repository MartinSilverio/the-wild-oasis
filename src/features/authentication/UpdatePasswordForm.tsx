import { useForm } from 'react-hook-form';
import Button from '../../ui/Button';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';

import { useUpdateUser } from './useUpdateUser';

interface TUpdatePassword {
    password: string;
    passwordConfirm: string;
}

function UpdatePasswordForm() {
    const { register, handleSubmit, formState, getValues, reset } =
        useForm<TUpdatePassword>();
    const { errors } = formState;

    const { updateUser, isUpdatingUser } = useUpdateUser();

    function onSubmit({ password }: TUpdatePassword) {
        updateUser({ password }, { onSuccess: () => reset() });
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <FormRow
                label="New password (min 8 chars)"
                error={errors?.password?.message}
            >
                <Input
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    disabled={isUpdatingUser}
                    {...register('password', {
                        required: 'This field is required',
                        minLength: {
                            value: 8,
                            message: 'Password needs a minimum of 8 characters',
                        },
                    })}
                />
            </FormRow>

            <FormRow
                label="Confirm password"
                error={errors?.passwordConfirm?.message}
            >
                <Input
                    type="password"
                    autoComplete="new-password"
                    id="passwordConfirm"
                    disabled={isUpdatingUser}
                    {...register('passwordConfirm', {
                        required: 'This field is required',
                        validate: (value) =>
                            getValues().password === value ||
                            'Passwords need to match',
                    })}
                />
            </FormRow>
            <FormRow>
                <>
                    <Button
                        onClick={() => reset()}
                        type="reset"
                        $variation="secondary"
                    >
                        Cancel
                    </Button>
                    <Button disabled={isUpdatingUser}>Update password</Button>
                </>
            </FormRow>
        </Form>
    );
}

export default UpdatePasswordForm;
