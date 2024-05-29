import {
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";

import { useI18n, useEditor, useModal } from "@providers";
import { MarkdownDocument } from "@models";

import { FileEarmarkFill } from "@styled-icons/bootstrap/FileEarmarkFill";
import { Plus } from "@styled-icons/bootstrap/Plus";
import { Delete } from "@styled-icons/fluentui-system-filled/Delete";

import styles from "./styles.module.scss";

function Documents() {
    const { t } = useI18n();
    const { document, updateDocument, deleteDocument, drafts, selectDocument } =
        useEditor();
    const modal = useModal();

    const confirmDeletionModal = (
        resolve: (confirmDeletion: boolean) => void
    ) => {
        modal.show({
            title: t("Are you sure you want to delete?"),
            hide: () => resolve(false),
            buttons: [
                {
                    color: "error",
                    onClick: () => resolve(false),
                    children: t("Cancel"),
                },
                {
                    color: "success",
                    onClick: () => resolve(true),
                    children: t("Confirm"),
                },
            ],
        });
    };

    const handleAddDocument = async () => {
        updateDocument(new MarkdownDocument());
    };

    const handleDeleteDocument = (draft: MarkdownDocument) => async () => {
        const promise = new Promise<boolean>(confirmDeletionModal);
        const confirmDeletion = await promise;
        if (confirmDeletion) deleteDocument(draft.uid);
    };

    return (
        <div className={styles.Documents}>
            <header className={styles.DocumentsHeader}>
                <h1 className={styles.DocumentsTitle}>{t("Documents")}</h1>
                <IconButton
                    className={styles.DocumentsAdd}
                    onClick={handleAddDocument}
                >
                    <Plus />
                </IconButton>
            </header>
            <List className={styles.DocumentsList}>
                {drafts.map((draft) => (
                    <ListItem
                        key={draft.uid}
                        className={styles.DocumentsItem}
                        onClick={() => selectDocument(draft.uid)}
                        selected={document.uid === draft.uid}
                        secondaryAction={
                            <IconButton
                                edge="end"
                                onClick={handleDeleteDocument(draft)}
                            >
                                <Delete />
                            </IconButton>
                        }
                    >
                        <ListItemIcon>
                            <FileEarmarkFill />
                        </ListItemIcon>
                        <ListItemText primary={draft.name} />
                    </ListItem>
                ))}
            </List>
        </div>
    );
}

export default Documents;
