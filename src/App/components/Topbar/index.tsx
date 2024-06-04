import { useState, useMemo } from "react";
import {
    FormControlLabel,
    Checkbox,
    TextField,
    MenuItem,
    SelectChangeEvent,
} from "@mui/material";

import { useTheme, useModal, useLoader, useEditor, useI18n } from "@providers";
import { getLanguageFlag, onEnterPress } from "@functions";
import { useForceUpdate, useInterval, useWindowSize } from "@hooks";
import { languageList, Language } from "@dictionaries";
import { Hamburger } from "@components";

import { Moon } from "@styled-icons/boxicons-regular/Moon";
import { Sun } from "@styled-icons/boxicons-regular/Sun";
import { Save } from "@styled-icons/boxicons-regular/Save";

import MenuButton, { MenuButtonProps } from "App/components/MenuButton";

import styles from "./styles.module.scss";

function Topbar() {
    const { t, timeAgo, language, setLanguage } = useI18n();
    const { toggleTheme, theme } = useTheme();
    const modal = useModal();
    const loader = useLoader();
    const forceUpdate = useForceUpdate();
    const editor = useEditor();
    const [windowWidth] = useWindowSize();

    const [hamburgerOpen, setHamburgerOpen] = useState(false);

    const showHamburguer = useMemo(() => windowWidth <= 700, [windowWidth]);

    const documentNameModal = (resolve: (name: string) => void) => {
        let name = "";

        const handleResolve = (response: string) => {
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
                    onKeyDown={onEnterPress(() => handleResolve(name))}
                    defaultValue={name}
                />
            ),
            hide: () => handleResolve(""),
            buttons: [
                {
                    color: "error",
                    onClick: () => handleResolve(""),
                    children: t("Cancel"),
                },
                {
                    color: "success",
                    onClick: () => handleResolve(name),
                    children: t("Confirm"),
                },
            ],
        });
    };

    const handleSave = async () => {
        let name = editor.document.name;
        const isNameless =
            !name || name === "Untitled" || name === t("Untitled");

        if (isNameless) {
            const promise = new Promise<string>(documentNameModal);

            name = await promise;
            modal.hide();
            if (!name) return;
        }

        loader.show();

        await editor.saveChanges({ name });

        loader.hide();
    };

    const handleChangeAutoSave = (evt: React.ChangeEvent<HTMLInputElement>) => {
        editor.setAutoSave(evt.target.checked);
    };

    const handleChangeLanguage = (evt: SelectChangeEvent<Language>) => {
        setLanguage(evt.target.value as Language);
    };

    useInterval(
        () => forceUpdate(),
        1 * 60 * 1000,
        [editor.document.uid],
        true
    );

    const menuButtons = useMemo(
        () =>
            [
                {
                    key: "save",
                    className: styles.TopbarButton,
                    label: t("Save"),
                    icon: <Save />,
                    onClick: handleSave,
                    disabled: editor.saving,
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
        [theme, language, editor.saving, editor.document.uid]
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
                            checked={editor.autoSave}
                        />
                    }
                />
                {editor.saving ? (
                    <p className={styles.TopbarSaving}>{t("Saving...")}</p>
                ) : (
                    editor.document.savedAt && (
                        <p className={styles.TopbarSaveDate}>
                            {t("Saved @timeAgo", {
                                timeAgo: timeAgo(editor.document.savedAt),
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
