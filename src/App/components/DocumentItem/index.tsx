import { useState, useEffect } from "react";
import {
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    TextField,
} from "@mui/material";

import { useI18n, useEditor, useModal } from "@providers";
import { MarkdownDocument } from "@models";

import { FileEarmarkFill } from "@styled-icons/bootstrap/FileEarmarkFill";
import { Delete } from "@styled-icons/fluentui-system-filled/Delete";
import { Save } from "@styled-icons/boxicons-regular/Save";

import styles from "./styles.module.scss";

interface DocumentItemProps {
    draft: MarkdownDocument;
}

function DocumentItem(props: DocumentItemProps) {
    const { draft } = props;

    const { t } = useI18n();
    const {
        document,
        updateDocument,
        deleteDocument,
        selectDocument,
        saveChanges,
    } = useEditor();
    const modal = useModal();

    const [documentName, setDocumentName] = useState(draft.name);
    const [showSaveButton, setShowSaveButton] = useState(false);

    const selected = document.uid === draft.uid;

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

    const handleDeleteDocument = async (
        evt: React.MouseEvent<HTMLButtonElement>
    ) => {
        evt.stopPropagation();
        const promise = new Promise<boolean>(confirmDeletionModal);
        const confirmDeletion = await promise;
        if (confirmDeletion) deleteDocument(draft.uid);
    };

    const handleSelectDocument = () => {
        selectDocument(draft.uid);
    };

    const handleChangeDocumentName = (
        evt: React.ChangeEvent<HTMLInputElement>
    ) => {
        setDocumentName(evt.target.value);
    };

    const handleSaveDocumentName = async () => {
        updateDocument({ name: documentName });
        await saveChanges();
    };

    const handleOnFocusInput = () => {
        setShowSaveButton(true);
    };

    const handleOnBlurInput = () => {
        setShowSaveButton(false);
    };

    useEffect(() => {
        setDocumentName(draft.name);
    }, [draft.name]);

    return (
        <ListItemButton
            key={draft.uid}
            component="li"
            className={styles.DocumentItem}
            onClick={handleSelectDocument}
            selected={selected}
        >
            <ListItem
                secondaryAction={
                    <IconButton
                        edge="end"
                        onClick={
                            showSaveButton
                                ? handleSaveDocumentName
                                : handleDeleteDocument
                        }
                    >
                        {showSaveButton ? <Save /> : <Delete />}
                    </IconButton>
                }
            >
                <ListItemIcon>
                    <FileEarmarkFill />
                </ListItemIcon>
                <ListItemText
                    primary={
                        selected ? (
                            <TextField
                                onFocus={handleOnFocusInput}
                                onBlur={handleOnBlurInput}
                                onChange={handleChangeDocumentName}
                                value={documentName}
                            />
                        ) : (
                            document.name
                        )
                    }
                />
            </ListItem>
        </ListItemButton>
    );
}

export default DocumentItem;
