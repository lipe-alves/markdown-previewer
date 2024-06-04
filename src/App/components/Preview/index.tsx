import { useEffect } from "react";

import { PREVIEW_ID } from "@constants";
import { scrollTogether } from "@functions";
import { useEditor } from "@providers";
import { useApp } from "App/providers";

import "./styles.scss";

function Preview() {
    const editor = useEditor();
    const {
        highlightedContainer,
        textareaElement,
        previewElement,
        setPreviewElement,
        autoScrollPreview,
    } = useApp();

    const handleOnScroll = () => {
        if (!highlightedContainer || !textareaElement || !previewElement) {
            return;
        }

        if (autoScrollPreview) {
            scrollTogether(previewElement, textareaElement);
            scrollTogether(previewElement, highlightedContainer);
        }
    };

    useEffect(() => {
        if (!previewElement) return;
        previewElement.innerHTML = editor.html;
    }, [previewElement, editor.html]);

    return (
        <div
            ref={setPreviewElement}
            id={PREVIEW_ID}
            onScroll={handleOnScroll}
        />
    );
}

export default Preview;
