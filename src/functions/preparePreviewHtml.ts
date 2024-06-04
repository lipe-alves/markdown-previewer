import { PREVIEW_ID } from "@constants";
import isLocal from "./isLocal";
import getPreviewStyleTag from "./getPreviewStyleTag";
import removeCssComments from "./removeCssComments";
import getMatchedCSSRules from "./getMatchedCSSRules";

function preparePreviewHtml(previewHtml?: string) {
    const previewElement = document.querySelector(
        `#${PREVIEW_ID}`
    ) as HTMLElement | null;
    if (!previewElement) return "";

    previewHtml = previewHtml || previewElement?.innerHTML || "";

    let html = `<article id="preview">${previewHtml}</article>`;
    const local = isLocal();

    let cssText = "";

    if (local) {
        const styleTag = getPreviewStyleTag();
        if (styleTag) {
            cssText = removeCssComments(styleTag.innerText);
        }
    } else {
        const cssRules = recursivelyListCSSRules(previewElement);
        cssText = cssRules.join("\n");
    }

    html += `<style>${cssText}</style>`;

    return html;
}

export default preparePreviewHtml;
export { preparePreviewHtml };

function isHTMLElement(input: any): input is HTMLElement {
    return input.nodeType === 1;
}

function recursivelyListCSSRules(element: HTMLElement): CSSRule[] {
    const allRules: CSSRule[] = [];

    const parentRules = getMatchedCSSRules(element);
    allRules.push(...parentRules);

    const children = Array.from(element.children);
    for (const child of children) {
        if (isHTMLElement(child)) {
            const rules = recursivelyListCSSRules(child);
            allRules.push(...rules);
        }
    }

    return allRules;
}
