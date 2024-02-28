import { ChangeEvent, FormEvent, useState } from 'react';

import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';

import { useUser } from './useUser';
import { UserMetadata } from '@supabase/supabase-js';
import { fullNameSchema } from '../../services/apiAuth';
import { assertIsDefined } from '../../utils/helpers';
import { useUpdateUser } from './useUpdateUser';

function UpdateUserDataForm() {
    // We don't need the loading state, and can immediately use the user data, because we know that it has already been loaded at this point
    const { user } = useUser();

    const { email, user_metadata } = user || {};

    assertIsDefined<UserMetadata>(user_metadata);
    const currentFullName = fullNameSchema.parse(user_metadata.fullName);

    const [fullName, setFullName] = useState(currentFullName);
    const [avatar, setAvatar] = useState<File | undefined>();
    const { updateUser, isUpdatingUser } = useUpdateUser();

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (fullName)
            updateUser(
                { fullName, avatar },
                {
                    onSuccess: () => {
                        setAvatar(undefined);
                        if (e.target instanceof HTMLFormElement)
                            e.target.reset();
                    },
                }
            );
    }

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;

        if (files) {
            const file = files[0];
            setAvatar(file);
        }
    }

    function handleCancel() {
        setFullName(currentFullName);
        setAvatar(undefined);
    }

    return (
        <Form onSubmit={handleSubmit}>
            <FormRow label="Email address">
                <Input value={email} disabled />
            </FormRow>
            <FormRow label="Full name">
                <Input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    id="fullName"
                    disabled={isUpdatingUser}
                />
            </FormRow>
            <FormRow label="Avatar image">
                <FileInput
                    id="avatar"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUpdatingUser}
                />
            </FormRow>
            <FormRow>
                <>
                    <Button
                        type="reset"
                        $variation="secondary"
                        disabled={isUpdatingUser}
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button disabled={isUpdatingUser}>Update account</Button>
                </>
            </FormRow>
        </Form>
    );
}

export default UpdateUserDataForm;
