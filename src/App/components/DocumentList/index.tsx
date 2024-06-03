import { IconButton, List } from "@mui/material";

import { useI18n, useEditor } from "@providers";

import { Plus } from "@styled-icons/bootstrap/Plus";

import DocumentItem from "App/components/DocumentItem";

import styles from "./styles.module.scss";

function DocumentList() {
    const { t } = useI18n();
    const editor = useEditor();

    const isANewDocument = !editor.drafts.find(
        (draft) => draft.uid === editor.document.uid
    );

    const handleAddDocument = async () => {
        editor.addBlankDocument();
    };

    return (
        <div
            className={styles.DocumentList}
            data-show={editor.drafts.length > 0}
        >
            <header className={styles.DocumentListHeader}>
                <h1 className={styles.DocumentListTitle}>{t("Documents")}</h1>
                <IconButton
                    className={styles.DocumentListAdd}
                    onClick={handleAddDocument}
                >
                    <Plus />
                </IconButton>
            </header>
            <List
                component="ul"
                className={styles.DocumentListList}
            >
                {editor.drafts.map((draft) => (
                    <DocumentItem
                        key={draft.uid}
                        draft={draft}
                    />
                ))}
                {isANewDocument && (
                    <DocumentItem
                        key={editor.document.uid}
                        draft={editor.document}
                    />
                )}
            </List>
        </div>
    );
}

export default DocumentList;
