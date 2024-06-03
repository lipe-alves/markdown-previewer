import { useMemo, useState } from "react";
import { IconButton, Tooltip } from "@mui/material";

import { useI18n, useModal, useEditor, useLoader } from "@providers";
import { useWindowSize } from "@hooks";
import {
    removeCssComments,
    getPreviewStyleTag,
    printHtml,
    downloadFile,
    createMarkdownFile,
    toNumber,
    getComputedStyle,
} from "@functions";
import { useApp } from "App/providers";

import { FullScreenMaximize } from "@styled-icons/fluentui-system-regular/FullScreenMaximize";
import {
    Printer,
    Download,
    FiletypeHtml,
    FiletypePdf,
} from "@styled-icons/bootstrap";

import styles from "./styles.module.scss";

type ExportFormat = "html" | "pdf";

function DocumentActions() {
    const { previewElement } = useApp();
    const { t } = useI18n();
    const modal = useModal();
    const editor = useEditor();
    const loader = useLoader();
    const [windowWidth, windowHeight] = useWindowSize();

    const iframeHtml = useMemo(() => {
        let html = `<article id="preview">${editor.html}</article>`;

        const styleTag = getPreviewStyleTag();
        if (!styleTag) return "";

        html += `<style>${removeCssComments(styleTag.innerText)}</style>`;

        return html;
    }, [editor.html]);

    const handleOpenFullscreen = () => {
        modal.show({
            title: t("Fullscreen view"),
            description: (
                <iframe
                    className={styles.FullscreenIframe}
                    src={`data:text/html;charset=utf-8,${encodeURIComponent(
                        iframeHtml
                    )}`}
                />
            ),
        });
    };

    const handlePrintDocument = () => {
        printHtml(iframeHtml);
    };

    const exportFormatModal = (
        resolve: (format: false | ExportFormat) => void
    ) => {
        const handleResolve = (response: false | ExportFormat) => () => {
            modal.hide();
            resolve(response);
        };

        modal.show({
            title: t("What format do you wish to export your markdown file?"),
            hide: handleResolve(false),
            buttons: [
                {
                    color: "error",
                    onClick: handleResolve(false),
                    children: t("Cancel"),
                },
                {
                    onClick: handleResolve("html"),
                    children: (
                        <>
                            <FiletypeHtml />
                            <span>HTML</span>
                        </>
                    ),
                },
                {
                    onClick: handleResolve("pdf"),
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

    const handleExportDocument = async () => {
        const promise = new Promise<false | "html" | "pdf">(exportFormatModal);
        const format = await promise;
        if (!format) return;

        try {
            loader.show();

            const file = await createMarkdownFile(
                editor.document.content,
                editor.document.name,
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

    const actions = useMemo(
        () => [
            {
                key: "fullscreen",
                label: t("Fullscreen"),
                icon: <FullScreenMaximize />,
                onClick: handleOpenFullscreen,
            },
            {
                key: "print",
                label: t("Print"),
                icon: <Printer />,
                onClick: handlePrintDocument,
            },
            {
                key: "download",
                label: t("Download"),
                icon: <Download />,
                onClick: handleExportDocument,
            },
        ],
        [iframeHtml]
    );

    const position = useMemo(() => {
        if (!previewElement) return { top: 16, right: 16 };

        const rect = previewElement.getBoundingClientRect();
        const paddingTop = toNumber(
            getComputedStyle(previewElement, "padding-top")
        );

        return { top: rect.y - paddingTop + 16, right: 16 };
    }, [previewElement, windowWidth, windowHeight]);

    return (
        <div
            className={styles.DocumentActions}
            style={{ ...position }}
        >
            {actions.map((action) => (
                <Tooltip
                    key={action.key}
                    title={action.label}
                >
                    <IconButton
                        className={styles.DocumentActionsAction}
                        onClick={action.onClick}
                    >
                        {action.icon}
                        <span>{action.label}</span>
                    </IconButton>
                </Tooltip>
            ))}
        </div>
    );
}

export default DocumentActions;
