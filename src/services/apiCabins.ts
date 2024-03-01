import { StringifiedData, assertIsDefined } from '../utils/helpers';
import supabase, { supabaseUrl } from './supabase';
import { z } from 'zod';

export const cabinSchema = z.object({
    id: z.number(),
    created_at: z.string(),
    name: z.string(),
    description: z.string(),
    discount: z.number(),
    image: z.string().nullable(),
    maxCapacity: z.number(),
    regularPrice: z.number(),
});

export type CabinType = z.infer<typeof cabinSchema>;
export type CabinSubmitType = StringifiedData<
    Omit<CabinType, 'id' | 'created_at' | 'image'>
> & {
    image: FileList | string | null;
};
export type CreateEditCabinData = StringifiedData<
    Omit<CabinType, 'id' | 'created_at' | 'image'>
> & {
    image: File | string | null;
};

const cabinArraySchema = z.array(cabinSchema);

export async function getCabins() {
    const { data, error } = await supabase.from('cabins').select('*');

    if (error) {
        console.error(error);
        throw new Error('Cabins could not be loaded');
    }

    return cabinArraySchema.parse(data);
}

export async function createEditCabin(
    newCabin: CreateEditCabinData,
    id?: number
) {
    const hasImagePath =
        typeof newCabin.image === 'string' &&
        newCabin.image.startsWith(supabaseUrl);

    let imagePath;
    let imageName;

    if (hasImagePath) {
        imagePath = newCabin.image;
    } else if (newCabin.image instanceof File) {
        imageName = `${Math.random()}-${newCabin.image.name}`.replace('/', '');
        imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;
    }
    const query = supabase.from('cabins');
    let builder;

    //1. Create cabin
    if (!id) {
        builder = query.insert([{ ...newCabin, image: imagePath }]);
    }

    if (id) {
        builder = query.update({ ...newCabin, image: imagePath }).eq('id', id);
    }

    assertIsDefined<typeof builder>(builder);
    const { data, error } = await builder.select().single();

    if (error) {
        console.error(error);
        throw new Error('Could not create cabin');
    }

    //2. Upload image if user is uploading an image
    if (newCabin.image instanceof File && imageName) {
        const { error: storageError } = await supabase.storage
            .from('cabin-images')
            .upload(imageName, newCabin.image);

        //3. Delete cabin if there was an error uploading the image
        if (storageError) {
            const parsedCabinData = cabinSchema.parse(data);
            await supabase.from('cabins').delete().eq('id', parsedCabinData.id);
            throw new Error(
                'Could image could not be uploaded and the cabin was not created'
            );
        }
    }

    return data;
}

export async function deleteCabin(id: number) {
    const { data, error } = await supabase.from('cabins').delete().eq('id', id);

    if (error) {
        console.error(error);
        throw new Error('Could not delete cabin');
    }

    return data;
}
