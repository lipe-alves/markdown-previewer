import {
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    TextField,
} from "@mui/material";

import {
    useI18n,
    useEditor,
    useModal,
    createEmptyMarkdownDocument,
} from "@providers";
import { MarkdownDocument } from "@models";

import { FileEarmarkFill } from "@styled-icons/bootstrap/FileEarmarkFill";
import { Plus } from "@styled-icons/bootstrap/Plus";
import { Delete } from "@styled-icons/fluentui-system-filled/Delete";

import DocumentItem from "../DocumentItem";

import styles from "./styles.module.scss";

function DocumentList() {
    const { t } = useI18n();
    const {
        document,
        updateDocument,
        deleteDocument,
        selectDocument,
        drafts,
        setDrafts,
    } = useEditor();
    const modal = useModal();

    const confirmDeletionModal = (
        resolve: (confirmDeletion: boolean) => void
    ) => {
        const handleResolve = (response: boolean) => () => {
            modal.hide();
            resolve(response);
        };

        modal.show({
            title: t("Are you sure you want to delete?"),
            hide: handleResolve(false),
            buttons: [
                {
                    color: "error",
                    onClick: handleResolve(false),
                    children: t("Cancel"),
                },
                {
                    color: "success",
                    onClick: handleResolve(true),
                    children: t("Confirm"),
                },
            ],
        });
    };

    const handleAddDocument = async () => {
        editor.addBlankDocument();
    };

    return (
        <div className={styles.DocumentList}>
            <header className={styles.DocumentListHeader}>
                <h1 className={styles.DocumentListTitle}>
                    {t("DocumentList")}
                </h1>
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
                {drafts.map((draft) => (
                    <DocumentItem
                        key={draft.uid}
                        draft={draft}
                    />
                ))}
            </List>
        </div>
    );
}

export default DocumentList;
