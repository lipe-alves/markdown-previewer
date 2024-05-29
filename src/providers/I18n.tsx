import { createContext, useContext, useEffect, useState } from "react";

import { timeAgo } from "@functions";
import { ContextProviderProps } from "@types";
import dictionaries, { Language, ReplaceMatrix } from "@dictionaries";

interface I18nValue {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (text: string, replaceMatrix?: ReplaceMatrix) => string;
    timeAgo: (date: Date) => string;
}

const I18nContext = createContext<I18nValue | undefined>(undefined);

function I18nProvider(props: ContextProviderProps) {
    const { children } = props;

    const [language, setLanguage] = useState<Language>(getBrowserLanguage());
    const [locale] = language.split("_");

    const translate = (text: string, replaceMatrix?: ReplaceMatrix) => {
        let translated = dictionaries[language][text] || text;

        if (replaceMatrix) {
            for (const [key, value] of Object.entries(replaceMatrix)) {
                const pattern = new RegExp(`@${key}`, "g");
                translated = translated.replace(pattern, value);
            }
        }

        return translated;
    };

    const formatAsTimeAgo = (date: Date) => {
        return timeAgo(date, locale) || "";
    };

    useEffect(() => {
        const [lang] = language.split("_");
        document.querySelector("html")!.setAttribute("lang", lang);
    }, [language]);

    return (
        <I18nContext.Provider
            value={{
                t: translate,
                language,
                setLanguage,
                timeAgo: formatAsTimeAgo,
            }}
        >
            {children}
        </I18nContext.Provider>
    );
}

function useI18n() {
    const context = useContext(I18nContext);

    if (!context) {
        throw new Error("useI18n must be used within a I18nProvider");
    }

    return context;
}

export { I18nContext, I18nProvider, useI18n };
export type { I18nValue };

function getBrowserLanguage(): Language {
    return navigator.language.replace("-", "_") as Language;
}
