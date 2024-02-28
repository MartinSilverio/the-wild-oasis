import { useState, useEffect, Dispatch } from 'react';

export function useLocalStorageState<T>(
    initialState: T,
    key: string
): [T, Dispatch<React.SetStateAction<T>>] {
    const [value, setValue] = useState<T>(function () {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : initialState;
    });

    useEffect(
        function () {
            localStorage.setItem(key, JSON.stringify(value));
        },
        [value, key]
    );

    return [value, setValue];
}
