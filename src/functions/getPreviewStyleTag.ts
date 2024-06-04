import { PREVIEW_ID } from "@constants";

function getPreviewStyleTag() {
    const styleTags: HTMLStyleElement[] = Array.from(
        document.querySelectorAll("style")
    );
    const styleTag = styleTags.find((styleTag) =>
        styleTag.innerText.includes(`#${PREVIEW_ID}`)
    );

    if (!styleTag) return undefined;

    return styleTag;
}

export default getPreviewStyleTag;
export { getPreviewStyleTag };
