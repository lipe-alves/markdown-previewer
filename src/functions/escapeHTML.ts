function escapeHTML(text: string) {
    text = text.replace(/</g, "&lt;");
    text = text.replace(/>/g, "&gt;");
    text = text.replace(/\//g, "\/");

    return text;
}

export default escapeHTML;
export { escapeHTML };
