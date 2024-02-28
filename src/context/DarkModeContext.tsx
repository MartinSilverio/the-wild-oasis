import { ReactNode, createContext, useContext, useEffect } from 'react';
import { useLocalStorageState } from '../hooks/useLocalStorageState';

interface TDarkModeContext {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

const DarkModeContext = createContext<TDarkModeContext | undefined>(undefined);

function DarkModeProvider({ children }: { children: ReactNode }) {
    const [isDarkMode, setIsDarkMode] = useLocalStorageState(
        false,
        'isDarkMode'
    );

    useEffect(
        function () {
            if (isDarkMode) {
                document.documentElement.classList.add('dark-mode');
                document.documentElement.classList.remove('light-mode');
            } else {
                document.documentElement.classList.remove('dark-mode');
                document.documentElement.classList.add('light-mode');
            }
        },
        [isDarkMode]
    );

    function toggleDarkMode() {
        setIsDarkMode((toggle) => !toggle);
    }

    return (
        <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
}

function useDarkMode() {
    const context = useContext(DarkModeContext);

    if (context === undefined) {
        throw new Error(
            'useDarkModeContext should be used inside Dark Mode Context'
        );
    }

    return context;
}

export { DarkModeProvider, useDarkMode };
