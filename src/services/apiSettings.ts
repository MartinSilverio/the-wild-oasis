import { z } from 'zod';
import supabase from './supabase';
import { Tables } from './supabase.types';

const settingSchema = z.object({
    id: z.number(),
    created_at: z.string(),
    breakfastPrice: z.number(),
    maxBookingLength: z.number(),
    maxGuestsPerBooking: z.number(),
    minBookingLength: z.number(),
});

export async function getSettings() {
    const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single();

    if (error) {
        console.error(error);
        throw new Error('Settings could not be loaded');
    }
    return settingSchema.parse(data);
}

// We expect a newSetting object that looks like {setting: newValue}
export async function updateSetting(newSetting: Partial<Tables<'settings'>>) {
    const { data, error } = await supabase
        .from('settings')
        .update(newSetting)
        // There is only ONE row of settings, and it has the ID=1, and so this is the updated one
        .eq('id', 1)
        .single();

    if (error) {
        console.error(error);
        throw new Error('Settings could not be updated');
    }
    return data;
}
