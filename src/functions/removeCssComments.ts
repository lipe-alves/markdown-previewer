function removeCssComments(cssString: string) {
    return cssString.replace(/\/\*[^*]*\*+([^/*][^*]*\*+)*\//g, "");
}

export default removeCssComments;
export { removeCssComments };
