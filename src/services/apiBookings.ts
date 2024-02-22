import { z } from 'zod';
import { getToday } from '../utils/helpers';
import supabase from './supabase';
import { cabinSchema } from './apiCabins';
import { guestSchema } from './apiGuests';
import { LabelValue } from '../utils/general.types';

const bookingSchema = z.object({
    id: z.number(),
    created_at: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    numNights: z.number(),
    numGuests: z.number(),
    cabinPrice: z.number(),
    extrasPrice: z.number(),
    totalPrice: z.number(),
    status: z.union([
        z.literal('unconfirmed'),
        z.literal('checked-in'),
        z.literal('checked-out'),
    ]),
    hasBreakfast: z.boolean(),
    isPaid: z.boolean(),
    observations: z.string().nullable(),
    cabinId: z.number(),
    guestId: z.number(),
    cabins: cabinSchema.pick({ name: true }),
    guests: guestSchema.pick({ fullName: true, email: true }),
});

const getBookingsArraySchema = z.array(
    bookingSchema.pick({
        id: true,
        created_at: true,
        startDate: true,
        endDate: true,
        numGuests: true,
        numNights: true,
        status: true,
        totalPrice: true,
        cabins: true,
        guests: true,
    })
);
export type GetBookingsType = z.infer<typeof getBookingsArraySchema>[number];
export type AllowableQueryMethods = 'eq' | 'lte' | 'gte';
export interface FilterAndSort {
    filter:
        | (LabelValue & {
              method: AllowableQueryMethods;
          })
        | null;
    sortBy: {
        field: string;
        direction: string;
    };
}

export async function getBookings({ filter, sortBy }: FilterAndSort) {
    let query = supabase
        .from('bookings')
        .select(
            'id, created_at, startDate, endDate, numGuests, numNights, status, totalPrice, cabins(name), guests(fullName, email)'
        );

    if (filter) {
        query = query[filter.method](filter.label, filter.value);
    }

    if (sortBy) {
        query = query.order(sortBy.field, {
            ascending: sortBy.direction === 'asc',
        });
    }

    const { data, error } = await query;

    if (error) {
        console.error(error);
        throw new Error('Could not get bookings');
    }

    return getBookingsArraySchema.parse(data);
}

export async function getBooking(id: number) {
    const { data, error } = await supabase
        .from('bookings')
        .select('*, cabins(*), guests(*)')
        .eq('id', id)
        .single();

    if (error) {
        console.error(error);
        throw new Error('Booking not found');
    }

    return data;
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
export async function getBookingsAfterDate(date: string) {
    const { data, error } = await supabase
        .from('bookings')
        .select('created_at, totalPrice, extrasPrice')
        .gte('created_at', date)
        .lte('created_at', getToday({ end: true }));

    if (error) {
        console.error(error);
        throw new Error('Bookings could not get loaded');
    }

    return data;
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date: string) {
    const { data, error } = await supabase
        .from('bookings')
        // .select('*')
        .select('*, guests(fullName)')
        .gte('startDate', date)
        .lte('startDate', getToday());

    if (error) {
        console.error(error);
        throw new Error('Bookings could not get loaded');
    }

    return data;
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
    const { data, error } = await supabase
        .from('bookings')
        .select('*, guests(fullName, nationality, countryFlag)')
        .or(
            `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
        )
        .order('created_at');

    // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
    // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
    // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

    if (error) {
        console.error(error);
        throw new Error('Bookings could not get loaded');
    }
    return data;
}

export async function updateBooking(id, obj) {
    const { data, error } = await supabase
        .from('bookings')
        .update(obj)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error(error);
        throw new Error('Booking could not be updated');
    }
    return data;
}

export async function deleteBooking(id) {
    // REMEMBER RLS POLICIES
    const { data, error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

    if (error) {
        console.error(error);
        throw new Error('Booking could not be deleted');
    }
    return data;
}
