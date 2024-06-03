import convertMarkdownToHtml from "./convertMarkdownToHtml";
import convertHtmlToPdf from "./convertHtmlToPdf";
import getPreviewStyleTag from "./getPreviewStyleTag";
import removeCssComments from "./removeCssComments";
import printHtml from "./printHtml";

async function createMarkdownFile(
    markdown: string,
    filename: string,
    format: "pdf" | "html" | "mk" = "mk"
): Promise<File | undefined | void> {
    if (!filename) filename = "untitled";

    let html = convertMarkdownToHtml(markdown);
    html = `<article id="preview">${html}</article>`;

    const styleTag = getPreviewStyleTag();
    if (!styleTag) return undefined;

    html += `<style>${removeCssComments(styleTag.innerText)}</style>`;

    if (format === "html") {
        const blob = new Blob([html], {
            type: "text/html;charset=utf-8",
        });
        const file = new File([blob], filename + ".html");
        return file;
    } else if (format === "pdf") {
        printHtml(html);
    } else {
        const blob = new Blob([markdown], {
            type: "text/markdown;charset=utf-8",
        });
        const file = new File([blob], filename + ".md");
        return file;
    }
}

export default createMarkdownFile;
export { createMarkdownFile };
