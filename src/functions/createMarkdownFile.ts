import convertMarkdownToHtml from "./convertMarkdownToHtml";
import printHtml from "./printHtml";
import preparePreviewHtml from "./preparePreviewHtml";

async function createMarkdownFile(
    markdown: string,
    filename: string,
    format: "pdf" | "html" | "mk" = "mk"
): Promise<File | undefined | void> {
    if (!filename) filename = "untitled";

    let html = convertMarkdownToHtml(markdown);
    html = preparePreviewHtml(html);

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
