import { useState, useEffect } from "react";
import {
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    TextField,
} from "@mui/material";

import { onEnterPress } from "@functions";
import { useI18n, useEditor, useModal, useLoader } from "@providers";
import { MarkdownDocument } from "@models";
import { GithubEmoji } from "@components";

import { Delete } from "@styled-icons/fluentui-system-filled/Delete";
import { Save } from "@styled-icons/boxicons-regular/Save";

import styles from "./styles.module.scss";

interface DocumentItemProps {
    draft: MarkdownDocument;
}

function DocumentItem(props: DocumentItemProps) {
    const { draft } = props;

    const { t } = useI18n();
    const editor = useEditor();
    const modal = useModal();
    const loader = useLoader();

    const [textFieldElement, setTextFieldElement] =
        useState<HTMLElement | null>(null);
    const [secondaryActionElement, setSecondaryActionElement] =
        useState<HTMLElement | null>(null);
    const [documentName, setDocumentName] = useState(draft.name);
    const [showSaveButton, setShowSaveButton] = useState(false);

    const isANewDocument = !editor.drafts.find(
        (item) => item.uid === draft.uid
    );
    const selected = editor.document.uid === draft.uid;

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
        if (confirmDeletion) editor.deleteDocument(draft.uid);
    };

    const handleSelectDocument = () => {
        editor.selectDocument(draft.uid);
    };

    const handleChangeDocumentName = (
        evt: React.ChangeEvent<HTMLInputElement>
    ) => {
        setDocumentName(evt.target.value);
    };

    const handleSaveDocumentName = async (
        evt:
            | React.MouseEvent<HTMLButtonElement>
            | React.KeyboardEvent<HTMLInputElement>
    ) => {
        evt.preventDefault();
        evt.stopPropagation();

        loader.show();

        editor.updateDocument({ name: documentName });
        await editor.saveChanges({ name: documentName });
        setShowSaveButton(false);

        loader.hide();
    };

    const handleCheckIfBlurredInput = (evt: MouseEvent) => {
        const target = evt.target as HTMLElement | null;
        if (!target || !secondaryActionElement || !textFieldElement) {
            return;
        }

        const targetIsTextField =
            target === textFieldElement || textFieldElement.contains(target);
        const targetIsSaveButton =
            secondaryActionElement === target ||
            secondaryActionElement.contains(target);

        if (!targetIsTextField && !targetIsSaveButton && !isANewDocument) {
            setShowSaveButton(false);
            window.removeEventListener("click", handleCheckIfBlurredInput);
        }
    };

    const handleOnFocusInput = () => {
        setShowSaveButton(true);
        window.addEventListener("click", handleCheckIfBlurredInput);
    };

    useEffect(() => {
        setDocumentName(draft.name);
    }, [draft.name]);

    useEffect(() => {
        if (isANewDocument) setShowSaveButton(isANewDocument);
    }, [isANewDocument]);

    return (
        <ListItemButton
            key={draft.uid}
            component="li"
            className={styles.DocumentItem}
            onClick={handleSelectDocument}
            selected={selected}
        >
            <ListItem
                component="div"
                secondaryAction={
                    <IconButton
                        ref={setSecondaryActionElement}
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
                    <GithubEmoji
                        name="page_with_curl"
                        size={20}
                    />
                </ListItemIcon>
                <ListItemText
                    primary={
                        selected ? (
                            <TextField
                                ref={setTextFieldElement}
                                variant="standard"
                                InputProps={{
                                    className: styles.DocumentItemNameInput,
                                }}
                                placeholder={t("Untitled")}
                                onKeyDown={onEnterPress(handleSaveDocumentName)}
                                onFocus={handleOnFocusInput}
                                onChange={handleChangeDocumentName}
                                value={documentName}
                            />
                        ) : (
                            draft.name
                        )
                    }
                />
            </ListItem>
        </ListItemButton>
    );
}

export default DocumentItem;
