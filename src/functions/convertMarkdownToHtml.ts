import { marked } from "marked";

function convertMarkdownToHtml(markdown: string): string {
    // @ts-ignore
    return marked.parse(markdown, {
        async: false,
        gfm: true,
        break: true,
    });
}

export default convertMarkdownToHtml;
export { convertMarkdownToHtml };
