import { useEffect } from "react";

import { useEditor } from "@providers";
import { useApp } from "../../providers";

import "./styles.scss";

function Preview() {
    const { html } = useEditor();
    const { previewElement, setPreviewElement } = useApp();

    useEffect(() => {
        if (!previewElement) return;
        previewElement.innerHTML = html;
    }, [previewElement, html]);

    return (
        <div
            ref={setPreviewElement}
            id="preview"
        />
    );
}

export default Preview;
