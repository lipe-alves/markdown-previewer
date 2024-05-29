import { createContext, useContext, useState, useEffect } from "react";
import { ContextProviderProps } from "@types";

type Theme = "light" | "dark";

interface ThemeValue {
    theme: Theme;
    setTheme: (newTheme: Theme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeValue | undefined>(undefined);

function ThemeProvider(props: ContextProviderProps) {
    const { children } = props;

    const [theme, setTheme] = useState<Theme>("light");

    const toggleTheme = () =>
        setTheme((prev) => (prev === "light" ? "dark" : "light"));

    useEffect(() => {
        document.body.dataset.theme = theme;
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
