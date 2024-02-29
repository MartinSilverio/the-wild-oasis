import { z } from 'zod';
import { getToday } from '../utils/helpers';
import supabase from './supabase';
import { cabinSchema } from './apiCabins';
import { guestSchema } from './apiGuests';
import { LabelValue } from '../utils/general.types';
import { PAGE_SIZE } from '../utils/constants';

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
});

const getBookingsSchema = bookingSchema.extend({
    cabins: cabinSchema.pick({ name: true }),
    guests: guestSchema.pick({ fullName: true, email: true }),
});

const getBookingSchema = bookingSchema.extend({
    cabins: cabinSchema,
    guests: guestSchema,
});

const getBookingsArraySchema = z.array(
    getBookingsSchema.pick({
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

const getBookingsAfterDateSchema = z.array(
    bookingSchema.pick({
        created_at: true,
        extrasPrice: true,
        totalPrice: true,
    })
);
const getStaysAfterDateSchema = z.array(
    bookingSchema.extend({
        guests: guestSchema.pick({ fullName: true }),
    })
);

const getStaysTodayActivitySchema = z.array(
    bookingSchema.extend({
        guests: guestSchema.pick({
            fullName: true,
            nationality: true,
            countryFlag: true,
        }),
    })
);

export type BookingType = z.infer<typeof bookingSchema>;
export type GetBookingsType = z.infer<typeof getBookingsArraySchema>[number];
export type GetBookingType = z.infer<typeof getBookingSchema>;
export type BookingsAfterDateType = z.infer<typeof getBookingsAfterDateSchema>;
export type StaysAfterDateType = z.infer<typeof getStaysAfterDateSchema>;
export type TodayActivitiesType = z.infer<typeof getStaysTodayActivitySchema>;
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
    page: number;
}

export async function getBookings({ filter, sortBy, page }: FilterAndSort) {
    let query = supabase
        .from('bookings')
        .select(
            'id, created_at, startDate, endDate, numGuests, numNights, status, totalPrice, cabins(name), guests(fullName, email)',
            { count: 'exact' }
        );

    if (filter) {
        query = query[filter.method](filter.label, filter.value);
    }

    if (sortBy) {
        query = query.order(sortBy.field, {
            ascending: sortBy.direction === 'asc',
        });
    }

    if (page) {
        const from = PAGE_SIZE * (page - 1);
        const to = from + PAGE_SIZE - 1;
        query = query.range(from, to);
    }

    const { data, error, count } = await query;

    if (error) {
        console.error(error);
        throw new Error('Could not get bookings');
    }

    return { data: getBookingsArraySchema.parse(data), count };
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

    return getBookingSchema.parse(data);
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

    return getBookingsAfterDateSchema.parse(data);
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date: string) {
    const { data, error } = await supabase
        .from('bookings')
        .select('*, guests(fullName)')
        .gte('startDate', date)
        .lte('startDate', getToday());

    if (error) {
        console.error(error);
        throw new Error('Bookings could not get loaded');
    }

    return getStaysAfterDateSchema.parse(data);
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
    return getStaysTodayActivitySchema.parse(data);
}

export async function updateBooking(id: number, obj: Partial<BookingType>) {
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
    return bookingSchema.parse(data);
}

export async function deleteBooking(id: number) {
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
