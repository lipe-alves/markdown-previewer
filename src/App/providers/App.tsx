import { createContext, useContext, useState } from "react";
import { ContextProviderProps } from "@types";

interface AppValue {
    highlightedContainer: HTMLPreElement | null;
    setHighlightedContainer: (element: HTMLPreElement | null) => void;
    textareaElement: HTMLTextAreaElement | null;
    setTextareaElement: (element: HTMLTextAreaElement | null) => void;
    previewElement: HTMLDivElement | null;
    setPreviewElement: (element: HTMLDivElement | null) => void;
    autoScrollPreview: boolean;
    setAutoScrollPreview: (autoScroll: boolean) => void;
}

const AppContext = createContext<AppValue | undefined>(undefined);

function AppProvider(props: ContextProviderProps) {
    const { children } = props;

    const [highlightedContainer, setHighlightedContainer] =
        useState<HTMLPreElement | null>(null);
    const [textareaElement, setTextareaElement] =
        useState<HTMLTextAreaElement | null>(null);
    const [previewElement, setPreviewElement] = useState<HTMLDivElement | null>(
        null
    );
    const [autoScrollPreview, setAutoScrollPreview] = useState(true);

    return (
        <AppContext.Provider
            value={{
                highlightedContainer,
                setHighlightedContainer,
                textareaElement,
                setTextareaElement,
                previewElement,
                setPreviewElement,
                autoScrollPreview,
                setAutoScrollPreview,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

function useApp() {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error("useApp must be used within a AppProvider!");
    }

    return context;
}

export { AppContext, AppProvider, useApp };
export type { AppValue };
