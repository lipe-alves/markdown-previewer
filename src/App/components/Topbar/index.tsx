import { useState, useMemo } from "react";
import {
    IconButton,
    Button,
    FormControlLabel,
    Checkbox,
    TextField,
    MenuItem,
    Select,
    SelectChangeEvent,
} from "@mui/material";

import { useTheme, useModal, useLoader, useEditor, useI18n } from "@providers";
import { downloadFile, createMarkdownFile, getLanguageFlag } from "@functions";
import { useForceUpdate, useInterval, useWindowSize } from "@hooks";
import { languageList, Language } from "@dictionaries";
import { Hamburger } from "@components";

import { Moon } from "@styled-icons/boxicons-regular/Moon";
import { Sun } from "@styled-icons/boxicons-regular/Sun";
import { Save } from "@styled-icons/boxicons-regular/Save";
import { ExportOutline } from "@styled-icons/typicons/ExportOutline";
import { FiletypeHtml } from "@styled-icons/bootstrap/FiletypeHtml";
import { FiletypePdf } from "@styled-icons/bootstrap/FiletypePdf";

import styles from "./styles.module.scss";

function Topbar() {
    const { t, timeAgo, language, setLanguage } = useI18n();
    const { toggleTheme, theme } = useTheme();
    const modal = useModal();
    const loader = useLoader();
    const forceUpdate = useForceUpdate();
    const { document, saving, saveChanges, autoSave, setAutoSave } =
        useEditor();
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

        modal.show({
            title: t("Type a name for your document"),
            description: (
                <TextField
                    fullWidth
                    type="text"
                    placeholder={t("My document")}
                    onChange={(evt) => (name = evt.target.value)}
                    defaultValue={name}
                />
            ),
            hide: () => resolve(""),
            buttons: [
                {
                    color: "error",
                    onClick: () => resolve(""),
                    children: t("Cancel"),
                },
                {
                    color: "success",
                    onClick: () => resolve(name),
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

        if (!name) {
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

    useInterval(() => {
        forceUpdate();
    }, 5 * 60 * 1000);

    const menuButtons = useMemo(() => {
        return [
            <Button
                className={styles.TopbarButton}
                onClick={handleExport}
            >
                <ExportOutline />
                <span>{t("Download")}</span>
            </Button>,
            <Button
                className={styles.TopbarButton}
                onClick={handleSave}
                disabled={saving}
            >
                <Save />
                <span>{t("Save")}</span>
            </Button>,
            <IconButton
                className={styles.TopbarThemeButton}
                onClick={toggleTheme}
            >
                {theme === "light" ? <Moon /> : <Sun />}
            </IconButton>,
            <Select
                className={styles.TopbarLanguageSelector}
                onChange={handleChangeLanguage}
                value={language}
            >
                {languageList.map((lang) => (
                    <MenuItem
                        key={lang}
                        className={styles.TopbarLanguageSelectorOption}
                        value={lang}
                        disabled={language === lang}
                    >
                        <span>{t(lang)}</span>
                        <img
                            src={getLanguageFlag(lang)}
                            alt={lang}
                        />
                    </MenuItem>
                ))}
            </Select>,
        ];
    }, [theme, language, saving]);

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
                    <>{menuButtons.map((button) => button)}</>
                ) : (
                    <Hamburger
                        open={hamburgerOpen}
                        onToggle={() => setHamburgerOpen((prev) => !prev)}
                    >
                        {menuButtons.map((button) => (
                            <li>{button}</li>
                        ))}
                    </Hamburger>
                )}
            </div>
        </header>
    );
}

export default Topbar;
