import styled from 'styled-components';
import { FieldErrors, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput';
import Textarea from '../../ui/Textarea';
import {
    CabinSubmitType,
    CabinType,
    CreateEditCabinData,
    createEditCabin,
} from '../../services/apiCabins';
import FormRow from '../../ui/FormRow';

const StyledForm = styled.div`
    display: grid;
    align-items: center;
    grid-template-columns: 24rem 1fr 1.2fr;
    gap: 2.4rem;

    padding: 1.2rem 0;

    &:first-child {
        padding-top: 0;
    }

    &:last-child {
        padding-bottom: 0;
    }

    &:not(:last-child) {
        border-bottom: 1px solid var(--color-grey-100);
    }

    &:has(button) {
        display: flex;
        justify-content: flex-end;
        gap: 1.2rem;
    }
`;

function convertToSubmittableForm(cabin: Partial<CabinType>) {
    return {
        ...cabin,
        discount: cabin.discount?.toString(),
        maxCapacity: cabin.maxCapacity?.toString(),
        regularPrice: cabin.regularPrice?.toString(),
    };
}

function CreateCabinForm({
    cabinToEdit = {},
}: {
    cabinToEdit: Partial<CabinType>;
}) {
    const { id: editId, ...editValues } = cabinToEdit;
    const isEditSession = editId !== undefined;

    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, getValues, formState } =
        useForm<CabinSubmitType>({
            defaultValues: isEditSession
                ? convertToSubmittableForm(editValues)
                : {},
        });

    const { errors } = formState;
    console.group(errors);

    const { mutate: createCabin, isPending: isCreating } = useMutation({
        mutationFn: createEditCabin,
        onSuccess: () => {
            toast.success('New cabin successfully created');
            queryClient.invalidateQueries({ queryKey: ['cabins'] });
            reset();
        },
        onError: (err) => toast.error(err.message),
    });

    const { mutate: editCabin, isPending: isEditing } = useMutation({
        mutationFn: ({
            newCabinData,
            id,
        }: {
            newCabinData: CreateEditCabinData;
            id: number;
        }) => createEditCabin(newCabinData, id),
        onSuccess: () => {
            toast.success('Cabin successfully edited');
            queryClient.invalidateQueries({ queryKey: ['cabins'] });
            reset(getValues());
        },
        onError: (err) => toast.error(err.message),
    });

    const isPending = isCreating || isEditing;

    function onSubmit(data: CabinSubmitType) {
        console.log(data);
        const image =
            data.image instanceof FileList ? data.image[0] : data.image;

        if (isEditSession) {
            if (typeof image === 'string') {
                editCabin({
                    newCabinData: { ...data, image },
                    id: editId,
                });
            }
        } else {
            createCabin({ ...data, image });
        }
    }

    function onError(errors: FieldErrors) {
        console.log(errors);
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit, onError)}>
            <FormRow label="Cabin name" error={errors.name?.message}>
                <Input
                    type="text"
                    id="name"
                    disabled={isPending}
                    {...register('name', {
                        required: 'This field is required',
                    })}
                />
            </FormRow>

            <FormRow
                label="Maximum capacity"
                error={errors.maxCapacity?.message}
            >
                <Input
                    type="number"
                    id="maxCapacity"
                    disabled={isPending}
                    {...register('maxCapacity', {
                        required: 'This field is required',
                        min: {
                            value: 1,
                            message: 'Capacity should be a t least one',
                        },
                    })}
                />
            </FormRow>

            <FormRow label="Regular price" error={errors.regularPrice?.message}>
                <Input
                    type="number"
                    id="regularPrice"
                    disabled={isPending}
                    {...register('regularPrice', {
                        required: 'This field is required',
                        min: {
                            value: 1,
                            message: 'Capacity should be a t least one',
                        },
                    })}
                />
            </FormRow>

            <FormRow label="Discount" error={errors.discount?.message}>
                <Input
                    type="number"
                    id="discount"
                    disabled={isPending}
                    defaultValue={0}
                    {...register('discount', {
                        required: 'This field is required',
                        validate: (value) => {
                            console.log(Number(getValues().regularPrice));
                            return (
                                Number(value) <
                                    Number(getValues().regularPrice) ||
                                'Discount should be less than the regular price'
                            );
                        },
                    })}
                />
            </FormRow>

            <FormRow label="Description" error={errors.description?.message}>
                <Textarea
                    type="number"
                    id="description"
                    disabled={isPending}
                    defaultValue=""
                    {...register('description', {
                        required: 'This field is required',
                    })}
                />
            </FormRow>

            <FormRow label="Cabin photo">
                <FileInput
                    id="image"
                    disabled={isPending}
                    accept="image/*"
                    {...register('image', {
                        required: isEditSession
                            ? false
                            : 'This field is required',
                    })}
                />
            </FormRow>

            <StyledForm>
                {/* type is an HTML attribute! */}
                <Button variation="secondary" type="reset">
                    Cancel
                </Button>
                <Button disabled={isPending}>
                    {isEditSession ? 'Edit cabin' : 'Add cabin'}
                </Button>
            </StyledForm>
        </Form>
    );
}

export default CreateCabinForm;
