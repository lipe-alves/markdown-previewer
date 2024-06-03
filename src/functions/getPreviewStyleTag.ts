function getPreviewStyleTag() {
    const styleTags: HTMLStyleElement[] = Array.from(
        document.querySelectorAll("style")
    );
    const styleTag = styleTags.find((styleTag) =>
        styleTag.innerText.includes("#preview")
    );

    if (!styleTag) return undefined;

    return styleTag;
}

export default getPreviewStyleTag;
export { getPreviewStyleTag };
