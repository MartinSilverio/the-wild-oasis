import { z } from 'zod';
import supabase, { supabaseUrl } from './supabase';

export const fullNameSchema = z.string();
export const avatarSchema = z.string();

export interface LoginObject {
    email: string;
    password: string;
}

export interface SignupObject {
    fullName: string;
    email: string;
    password: string;
}

export interface UpdateObject {
    password?: string;
    data?: {
        fullName?: string;
    };
    avatar?: File;
}

export async function signUp({ fullName, email, password }: SignupObject) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                fullName,
                avatar: '',
            },
        },
    });

    if (error) throw new Error(error.message);

    return data;
}

export async function login({ email, password }: LoginObject) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        throw new Error(error.message);
    }

    console.log(data);
    return data;
}

export async function getCurrentUser() {
    const { data: session } = await supabase.auth.getSession();

    console.log('getting session');
    if (!session.session) return null;

    const { data, error } = await supabase.auth.getUser();

    console.log(data);

    if (error) throw new Error(error.message);

    return data?.user;
}

export async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) throw new Error(error.message);
}

export async function updateCurrentUser({
    password,
    fullName,
    avatar,
}: Pick<UpdateObject, 'password' | 'avatar'> & { fullName?: string }) {
    //1. Update password or fullname
    let updateData: UpdateObject = {};

    if (password) updateData = { password };
    if (fullName) updateData = { data: { fullName } };

    const { data, error } = await supabase.auth.updateUser(updateData);

    if (error) throw new Error(error.message);

    //2. Upload the avatar image
    const fileName = `avatar-${data.user.id}-${Math.random()}`;

    if (avatar) {
        const { error: storageError } = await supabase.storage
            .from('avatars')
            .upload(fileName, avatar);

        if (storageError) throw new Error(storageError.message);

        //3. Update avatar in the user
        const { data: finalData, error: finalUpdateError } =
            await supabase.auth.updateUser({
                data: {
                    avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
                },
            });

        if (finalUpdateError) throw new Error(finalUpdateError.message);

        return finalData;
    }

    return data;
}
