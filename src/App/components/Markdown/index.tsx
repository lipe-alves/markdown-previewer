import { useEffect, useMemo } from "react";

import { useEditor } from "@providers";
import { useApp } from "../../providers";
import {
    highlightMarkdown,
    matchScrollHeights,
    scrollTogether,
} from "@functions";

import styles from "./styles.module.scss";

function Markdown() {
    const editor = useEditor();
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
        editor.updateDocument({ content: value });
    };

    const handleOnScroll = () => {
        if (!highlightedContainer || !textareaElement || !previewElement) {
            return;
        }

        scrollTogether(textareaElement, highlightedContainer);
        if (autoScrollPreview) {
            scrollTogether(textareaElement, previewElement);
        }
    };

    const highlightedMarkdown = useMemo(
        () => highlightMarkdown(editor.document.content, false),
        [editor.document.content]
    );

    useEffect(() => {
        if (!highlightedContainer) return;
        highlightedContainer.innerHTML = highlightedMarkdown;
    }, [highlightedContainer, highlightedMarkdown]);

    useEffect(() => {
        if (!textareaElement || !highlightedContainer) return;
        matchScrollHeights(textareaElement, highlightedContainer);
    }, [textareaElement, highlightedContainer]);

    return (
        <div className={styles.Markdown}>
            <textarea
                id="editor"
                ref={setTextareaElement}
                className={styles.MarkdownTextarea}
                onChange={handleTextareaChange}
                onScroll={handleOnScroll}
                value={editor.document.content}
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
