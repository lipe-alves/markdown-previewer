import { createContext, useContext, useState, useEffect } from "react";

import { ContextProviderProps } from "@types";
import { THEME_KEY } from "@constants";

const validThemes = ["light", "dark"] as const;

type Theme = (typeof validThemes)[number];

interface ThemeValue {
    theme: Theme;
    setTheme: (newTheme: Theme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeValue | undefined>(undefined);

function ThemeProvider(props: ContextProviderProps) {
    const { children } = props;
    const [theme, setTheme] = useState<Theme>(getLocalTheme());

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    useEffect(() => {
        document.body.dataset.theme = theme;
        localStorage.setItem(THEME_KEY, theme);
    }, [theme]);

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme,
                toggleTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider!");
    }

    return context;
}

export { ThemeContext, ThemeProvider, useTheme };
export type { ThemeValue };

function getBrowserTheme(): Theme | undefined {
    if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
        return "dark";
    }

    if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: light)").matches
    ) {
        return "dark";
    }

    return undefined;
}

function getLocalTheme(): Theme {
    const localStorageTheme = validThemes.find(
        (theme) => theme === localStorage.getItem(THEME_KEY)
    );
    const browserTheme = getBrowserTheme();
    const defaultTheme = "light";
    return localStorageTheme /*|| browserTheme*/ || defaultTheme;
}
