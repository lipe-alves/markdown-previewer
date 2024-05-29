import { createContext, useContext, useState, useMemo, useEffect } from "react";

import { AUTO_SAVE_KEY, INITIAL_MK_CONTENT } from "@constants";
import { ContextProviderProps } from "@types";
import { convertMarkdownToHtml } from "@functions";
import { MarkdownDocument } from "@models";
import { useInterval } from "@hooks";
import { mkDocuments } from "@services";

import { useLoader } from "./Loader";

interface EditorValue {
    saving: boolean;

    drafts: MarkdownDocument[];
    document: MarkdownDocument;
    updateDocument: (updates: Partial<MarkdownDocument>) => void;
    selectDocument: (uid: string) => void;
    deleteDocument: (uid: string) => void;
    html: string;

    autoSave: boolean;
    setAutoSave: (autoSave: boolean) => void;
    toggleAutoSave: () => void;

    saveChanges: (changes?: Partial<MarkdownDocument>) => Promise<void>;
}

const EditorContext = createContext<EditorValue | undefined>(undefined);

function EditorProvider(props: ContextProviderProps) {
    const { children } = props;
    const loader = useLoader();

    const [saving, setSaving] = useState(false);
    const [drafts, setDrafts] = useState<MarkdownDocument[]>([]);
    const [document, setDocument] = useState<MarkdownDocument>(
        new MarkdownDocument({
            content: INITIAL_MK_CONTENT,
        })
    );
    const [autoSave, setAutoSave] = useState(
        localStorage.getItem(AUTO_SAVE_KEY) === "true"
    );

    const html = useMemo(
        () => convertMarkdownToHtml(document.content),
        [document.content]
    );

    const updateDocument = (updates: Partial<MarkdownDocument>) => {
        setDocument((prev) => ({
            ...prev,
            ...updates,
            uid: prev.uid,
        }));
    };

    const selectDocument = (uid: string) => {
        const docToSelect = drafts.find((doc) => doc.uid === uid);
        if (docToSelect) setDocument(docToSelect);
    };

    const deleteDocument = (uid: string) => {
        const docToDelete = drafts.find((doc) => doc.uid === uid);
        if (docToDelete) {
            mkDocuments.delete(docToDelete);
            fetchDrafts();
        }
    };

    const fetchDrafts = () => {
        const docs = mkDocuments.list();
        setDrafts(docs);
    };

    const toggleAutoSave = () => {
        setAutoSave((prev) => !prev);
    };

    const saveChanges = (changes?: Partial<MarkdownDocument>) => {
        return new Promise<void>((resolve) => {
            setSaving(true);

            setTimeout(() => {
                const changedDoc = new MarkdownDocument({
                    ...document,
                    ...changes,
                });
                const updatedDoc = mkDocuments.save(changedDoc);

                setDocument(updatedDoc);
                fetchDrafts();
                setSaving(false);
                resolve();
            }, 3 * 1000);
        });
    };

    useEffect(() => {
        if (!autoSave) return;
        localStorage.setItem(AUTO_SAVE_KEY, String(autoSave));
    }, [autoSave]);

    useEffect(() => {
        loader.show();

        setTimeout(() => {
            fetchDrafts();
            loader.hide();
        }, 3000);
    }, []);

    useInterval(
        (id) => {
            if (!autoSave) return clearInterval(id);
            saveChanges();
        },
        5 * 60 * 1000,
        [autoSave]
    );

    return (
        <EditorContext.Provider
            value={{
                saving,
                drafts,
                document,
                updateDocument,
                selectDocument,
                deleteDocument,
                html,
                autoSave,
                setAutoSave,
                toggleAutoSave,
                saveChanges,
            }}
        >
            {children}
        </EditorContext.Provider>
    );
}

function useEditor() {
    const context = useContext(EditorContext);

    if (!context) {
        throw new Error("useEditor must be used within a EditorProvider!");
    }

    return context;
}

export { EditorContext, EditorProvider, useEditor };
export type { EditorValue };
