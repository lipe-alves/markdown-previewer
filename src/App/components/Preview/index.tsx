import { useEffect } from "react";

import { useEditor } from "@providers";
import { useApp } from "../../providers";

import "./styles.scss";

function Preview() {
    const editor = useEditor();
    const { previewElement, setPreviewElement } = useApp();

    useEffect(() => {
        if (!previewElement) return;
        previewElement.innerHTML = editor.html;
    }, [previewElement, editor.html]);

    return (
        <div
            ref={setPreviewElement}
            id="preview"
        />
    );
}

export default Preview;
