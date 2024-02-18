import { FocusEvent } from 'react';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import Spinner from '../../ui/Spinner';
import { useSettings } from './useSettings';
import { useUpdateSetting } from './useUpdateSetting';
import { Tables } from '../../services/supabase.types';

function UpdateSettingsForm() {
    const { isPending, settings } = useSettings();

    const {
        maxBookingLength,
        minBookingLength,
        maxGuestsPerBooking,
        breakfastPrice,
    } = settings || {};

    const { updateSetting, isUpdating } = useUpdateSetting();

    function handleUpdate(
        e: FocusEvent<HTMLInputElement>,
        key: keyof Tables<'settings'>
    ) {
        const { value } = e.target;

        if (!value) return;
        if (settings && +value === settings[key]) return;

        updateSetting({ [key]: value });
    }

    if (isPending) return <Spinner />;

    return (
        <Form>
            <FormRow label="Minimum nights/booking">
                <Input
                    type="number"
                    id="min-nights"
                    defaultValue={minBookingLength}
                    onBlur={(e) => handleUpdate(e, 'minBookingLength')}
                    disabled={isUpdating}
                />
            </FormRow>

            <FormRow label="Maximum nights/booking">
                <Input
                    type="number"
                    id="max-nights"
                    defaultValue={maxBookingLength}
                    onBlur={(e) => handleUpdate(e, 'maxBookingLength')}
                    disabled={isUpdating}
                />
            </FormRow>

            <FormRow label="Maximum guests/booking">
                <Input
                    type="number"
                    id="max-guests"
                    defaultValue={maxGuestsPerBooking}
                    onBlur={(e) => handleUpdate(e, 'maxGuestsPerBooking')}
                    disabled={isUpdating}
                />
            </FormRow>

            <FormRow label="Breakfast price">
                <Input
                    type="number"
                    id="breakfast-price"
                    defaultValue={breakfastPrice}
                    onBlur={(e) => handleUpdate(e, 'breakfastPrice')}
                    disabled={isUpdating}
                />
            </FormRow>
        </Form>
    );
}

export default UpdateSettingsForm;
