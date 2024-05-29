function highlightMarkdown(markdown: string, addLines = false): string {
    // Normalize to \n for newlines
    markdown = markdown.replace(/(\r\n|\n|\r)/g, "\n");

    // Titles
    markdown = markdown.replace(
        /(\#+\s[^\n]+)/g,
        '<span data-mk-element="title">$1</span>'
    );

    // Unordered lists
    markdown = markdown.replace(
        /(^\s*\*\s.*$)/gm,
        '<span data-mk-element="unordered-list">$1</span>'
    );

    // Ordered lists
    markdown = markdown.replace(
        /(^\s*\d+\.\s.*$)/gm,
        '<span data-mk-element="ordered-list">$1</span>'
    );

    // Italic
    markdown = markdown.replace(
        /([^\*]\*[^\*][^\n]+[^\*]\*[^\*])/g,
        '<span data-mk-element="italic">$1</span>'
    );
    markdown = markdown.replace(
        /([^_]_[^_][^\n]+[^_]_[^_])/g,
        '<span data-mk-element="italic">$1</span>'
    );

    // Bold
    markdown = markdown.replace(
        /(\*\*[^\n]+\*\*)/g,
        '<span data-mk-element="bold">$1</span>'
    );
    markdown = markdown.replace(
        /(__[^\n]+__)/g,
        '<span data-mk-element="bold">$1</span>'
    );

    if (addLines) {
        const lines = markdown.split("\n");

        for (let lineIndex of Object.keys(lines)) {
            const index = Number(lineIndex);
            const lineNumber = index + 1;
            const lineText = lines[index];

            lines[
                index
            ] = `<span data-line-number="true">${lineNumber}.</span>${lineText}`;
        }

        markdown = lines.join("\n");
    }

    // Replace all \n by <br>
    markdown = markdown.replace(/\n/g, "<br>");

    return markdown;
}

export { highlightMarkdown };
export default highlightMarkdown;
