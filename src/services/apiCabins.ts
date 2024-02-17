import { StringifiedData } from '../utils/helpers';
import supabase, { supabaseUrl } from './supabase';
import { z } from 'zod';

const cabinSchema = z.object({
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
export type CabinSubmit = Omit<CabinType, 'id' | 'created_at'>;
export type CabinSubmitNoImage = Omit<CabinType, 'id' | 'created_at' | 'image'>;
export type CabinSubmitWithImageList = StringifiedData<CabinSubmitNoImage> & {
    image: FileList;
};
export type CabinSubmitWithImage = StringifiedData<CabinSubmitNoImage> & {
    image: File;
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

export async function createCabin(newCabin: CabinSubmitWithImage) {
    const imageName = `${Math.random()}-${newCabin.image.name}`.replace(
        '/',
        ''
    );
    const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

    //1. Create cabin
    const { data, error } = await supabase
        .from('cabins')
        .insert([{ ...newCabin, image: imagePath }])
        .select();

    if (error) {
        console.log(error);
        throw new Error('Could not create cabin');
    }

    //2. Upload image
    const { error: storageError } = await supabase.storage
        .from('cabin-images')
        .upload(imageName, newCabin.image);

    //3. Delete cabin if there was an error uploading the image
    if (storageError) {
        const parsedCabinData = cabinSchema.parse(data);
        await supabase.from('cabins').delete().eq('id', parsedCabinData.id);
        console.log(error);
        throw new Error(
            'Could image could not be uploaded and the cabin was not created'
        );
    }

    console.log(data);
    return data;
}

export async function deleteCabin(id: number) {
    const { data, error } = await supabase.from('cabins').delete().eq('id', id);

    if (error) {
        console.log(error);
        throw new Error('Could not delete cabin');
    }

    return data;
}
