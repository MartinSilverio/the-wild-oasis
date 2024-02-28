import { z } from 'zod';
import supabase from './supabase';

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
