import { useEffect, useMemo } from "react";

import { useEditor } from "@providers";
import { useApp } from "../../providers";
import { highlightMarkdown, getComputedStyle, toNumber } from "@functions";

import styles from "./styles.module.scss";

function Markdown() {
    const { document, updateDocument } = useEditor();
    const {
        highlightedContainer,
        setHighlightedContainer,
        textareaElement,
        setTextareaElement,
        previewElement,
        autoScrollPreview,
    } = useApp();

    const handleTextareaChange = (
        evt: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const value = evt.target.value;
        updateDocument({ content: value });
    };

    const handleOnScroll = () => {
        if (!highlightedContainer || !textareaElement || !previewElement) {
            return;
        }

        const scrollPercentage =
            textareaElement.scrollTop / textareaElement.scrollHeight;

        highlightedContainer.scrollTop =
            scrollPercentage * highlightedContainer.scrollHeight;
        if (autoScrollPreview) {
            previewElement.scrollTop =
                scrollPercentage * previewElement.scrollHeight;
        }
    };

    const highlightedMarkdown = useMemo(
        () => highlightMarkdown(document.content, false),
        [document.content]
    );

    useEffect(() => {
        if (!highlightedContainer) return;
        highlightedContainer.innerHTML = highlightedMarkdown;
    }, [highlightedContainer, highlightedMarkdown]);

    useEffect(() => {
        if (!textareaElement || !previewElement) return;

        const previewPaddingTop = toNumber(
            getComputedStyle(textareaElement, "padding-top")
        );
        const previewPaddingBottom = toNumber(
            getComputedStyle(textareaElement, "padding-bottom")
        );
        const previewVerticalPadding = previewPaddingTop + previewPaddingBottom;
        const previewNewHeight =
            textareaElement.offsetHeight - previewVerticalPadding;

        previewElement.style.height = `${previewNewHeight}px`;
    }, [textareaElement, previewElement]);

    return (
        <div className={styles.Markdown}>
            <textarea
                id="editor"
                ref={setTextareaElement}
                className={styles.MarkdownTextarea}
                onChange={handleTextareaChange}
                onScroll={handleOnScroll}
                value={document.content}
                spellCheck={false}
            />
            <pre
                ref={setHighlightedContainer}
                className={styles.MarkdownHighlighted}
            />
        </div>
    );
}

export default Markdown;
