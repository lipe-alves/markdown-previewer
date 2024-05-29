import convertMarkdownToHtml from "./convertMarkdownToHtml";
import convertHtmlToPdf from "./convertHtmlToPdf";

async function createMarkdownFile(
    markdown: string,
    filename: string,
    format: "pdf" | "html" | "mk" = "mk"
): Promise<File | undefined> {
    let html = convertMarkdownToHtml(markdown);
    html = `<article id="preview">${html}</article>`;

    const styleTag: HTMLStyleElement | null = document.querySelector(
        '[id="/src/App/components/Preview/styles.scss:-css"]'
    );
    if (!styleTag) return undefined;

    html += `<style>${styleTag.innerText}</style>`;

    if (format === "html") {
        const blob = new Blob([html], {
            type: "text/html;charset=utf-8",
        });
        const file = new File([blob], filename + ".html");
        return file;
    } else if (format === "pdf") {
        const file = await convertHtmlToPdf(html, filename + ".pdf");
        return file;
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
