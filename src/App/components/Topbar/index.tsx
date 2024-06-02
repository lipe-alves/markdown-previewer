import { useState, useMemo } from "react";
import {
    FormControlLabel,
    Checkbox,
    TextField,
    MenuItem,
    SelectChangeEvent,
} from "@mui/material";

import { useTheme, useModal, useLoader, useEditor, useI18n } from "@providers";
import {
    downloadFile,
    createMarkdownFile,
    getLanguageFlag,
    onEnterPress,
} from "@functions";
import { useForceUpdate, useInterval, useWindowSize } from "@hooks";
import { languageList, Language } from "@dictionaries";
import { Hamburger } from "@components";
import { MarkdownDocument } from "@models";

import { Moon } from "@styled-icons/boxicons-regular/Moon";
import { Sun } from "@styled-icons/boxicons-regular/Sun";
import { Save } from "@styled-icons/boxicons-regular/Save";
import { ExportOutline } from "@styled-icons/typicons/ExportOutline";
import { FiletypeHtml } from "@styled-icons/bootstrap/FiletypeHtml";
import { FiletypePdf } from "@styled-icons/bootstrap/FiletypePdf";

import MenuButton, { MenuButtonProps } from "../MenuButton";

import styles from "./styles.module.scss";

function Topbar() {
    const { t, timeAgo, language, setLanguage } = useI18n();
    const { toggleTheme, theme } = useTheme();
    const modal = useModal();
    const loader = useLoader();
    const forceUpdate = useForceUpdate();
    const {
        document,
        saving,
        updateDocument,
        saveChanges,
        autoSave,
        setAutoSave,
    } = useEditor();
    const [windowWidth] = useWindowSize();

    const [hamburgerOpen, setHamburgerOpen] = useState(false);

    const showHamburguer = useMemo(() => windowWidth <= 700, [windowWidth]);

    const exportFormatModal = (
        resolve: (format: false | "html" | "pdf") => void
    ) => {
        modal.show({
            title: t("What format do you wish to export your markdown file?"),
            hide: () => resolve(false),
            buttons: [
                {
                    color: "error",
                    onClick: () => resolve(false),
                    children: t("Cancel"),
                },
                {
                    onClick: () => resolve("html"),
                    children: (
                        <>
                            <FiletypeHtml />
                            <span>HTML</span>
                        </>
                    ),
                },
                {
                    onClick: () => resolve("pdf"),
                    children: (
                        <>
                            <FiletypePdf />
                            <span>PDF</span>
                        </>
                    ),
                },
            ],
        });
    };

    const documentNameModal = (resolve: (name: string) => void) => {
        let name = "";

        const handleResolve = (response: string) => () => {
            modal.hide();
            resolve(response);
        };

        modal.show({
            title: t("Type a name for your document"),
            description: (
                <TextField
                    fullWidth
                    type="text"
                    placeholder={t("My document")}
                    onChange={(evt) => (name = evt.target.value)}
                    onKeyDown={onEnterPress(handleResolve(name))}
                    defaultValue={name}
                />
            ),
            hide: handleResolve(""),
            buttons: [
                {
                    color: "error",
                    onClick: handleResolve(""),
                    children: t("Cancel"),
                },
                {
                    color: "success",
                    onClick: handleResolve(name),
                    children: t("Confirm"),
                },
            ],
        });
    };

    const handleExport = async () => {
        const promise = new Promise<false | "html" | "pdf">(exportFormatModal);
        const format = await promise;
        modal.hide();
        if (!format) return;

        try {
            loader.show();

            const file = await createMarkdownFile(
                document.content,
                document.name,
                format
            );
            if (!file) return;

            await downloadFile(file);
        } catch (error) {
            console.error(error);
            modal.error({
                title: t("An unexpected error occurred"),
                description: (error as Error).message,
            });
        } finally {
            loader.hide();
        }
    };

    const handleSave = async () => {
        let name = document.name;
        const isNameless =
            !name || name === "Untitled" || name === t("Untitled");

        if (isNameless) {
            const promise = new Promise<string>(documentNameModal);

            name = await promise;
            modal.hide();
            if (!name) return;
        }

        loader.show();

        await saveChanges({ name });

        loader.hide();
    };

    const handleChangeAutoSave = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setAutoSave(evt.target.checked);
    };

    const handleChangeLanguage = (evt: SelectChangeEvent<Language>) => {
        setLanguage(evt.target.value as Language);
    };

    const handleDocumentChange =
        (prop: keyof MarkdownDocument, isCheckbox = false) =>
        (evt: React.ChangeEvent<HTMLInputElement>) => {
            updateDocument({
                [prop]: evt.target[isCheckbox ? "checked" : "value"],
            });
        };

    useInterval(() => {
        forceUpdate();
    }, 5 * 60 * 1000);

    const menuButtons = useMemo(
        () =>
            [
                {
                    key: "download",
                    className: styles.TopbarButton,
                    label: t("Download"),
                    icon: <ExportOutline />,
                    onClick: handleExport,
                    disabled: false,
                    iconButton: false,
                    selector: false,
                },
                {
                    key: "save",
                    className: styles.TopbarButton,
                    label: t("Save"),
                    icon: <Save />,
                    onClick: handleSave,
                    disabled: saving,
                    iconButton: false,
                    selector: false,
                },
                {
                    key: "language",
                    className: styles.TopbarLanguageSelector,
                    onChange: handleChangeLanguage,
                    value: language,
                    selector: true,
                    options: languageList.map((lang) => ({
                        label: t(lang),
                        className: styles.TopbarLanguageSelectorOption,
                        value: lang,
                        disabled: language === lang,
                        icon: (
                            <img
                                src={getLanguageFlag(lang)}
                                alt={lang}
                            />
                        ),
                    })),
                },
                {
                    key: "theme",
                    className: styles.TopbarThemeButton,
                    label: t(theme === "light" ? "Light theme" : "Dark theme"),
                    icon: theme === "light" ? <Sun /> : <Moon />,
                    onClick: toggleTheme,
                    disabled: false,
                    iconButton: true,
                    selector: false,
                },
            ] as MenuButtonProps[],
        [theme, language, saving, document.uid]
    );

    return (
        <header className={styles.Topbar}>
            <div className={styles.TopbarLeft} />
            <div className={styles.TopbarRight}>
                <FormControlLabel
                    className={styles.TopbarAutoSave}
                    label={t("Auto save")}
                    control={
                        <Checkbox
                            onChange={handleChangeAutoSave}
                            checked={autoSave}
                        />
                    }
                />
                {saving ? (
                    <p className={styles.TopbarSaving}>{t("Saving...")}</p>
                ) : (
                    document.savedAt && (
                        <p className={styles.TopbarSaveDate}>
                            {t("Saved @timeAgo", {
                                timeAgo: timeAgo(document.savedAt),
                            })}
                        </p>
                    )
                )}
                {!showHamburguer ? (
                    <>
                        {menuButtons.map((props) => (
                            <MenuButton
                                {...props}
                                key={props.key}
                            />
                        ))}
                    </>
                ) : (
                    <Hamburger
                        open={hamburgerOpen}
                        onToggle={() => setHamburgerOpen((prev) => !prev)}
                    >
                        {menuButtons.map((props) => (
                            <MenuItem key={props.key}>
                                <MenuButton
                                    {...props}
                                    isMobile
                                />
                            </MenuItem>
                        ))}
                    </Hamburger>
                )}
            </div>
        </header>
    );
}

export default Topbar;
