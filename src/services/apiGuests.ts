import { z } from 'zod';

export const guestSchema = z.object({
    id: z.number(),
    created_at: z.string(),
    fullName: z.string(),
    email: z.string(),
    nationalID: z.string(),
    nationality: z.string(),
    countryFlag: z.string().nullable(),
});
