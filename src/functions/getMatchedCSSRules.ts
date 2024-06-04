// @ts-nocheck
import isSameOrigin from "./isSameOrigin";

function getMatchedCSSRules(element: HTMLElement): CSSRule[] {
    const allRules = [];

    const localStylesheets = Array.from(document.styleSheets).filter(
        (stylesheet) => {
            const href = stylesheet.href;
            if (!href) return true;

            const thisPageUrl = window.location.href;
            return isSameOrigin(thisPageUrl, href);
        }
    );

    element.matches =
        element.matches ||
        element.webkitMatchesSelector ||
        element.mozMatchesSelector ||
        element.msMatchesSelector ||
        element.oMatchesSelector;

    for (const stylesheet of localStylesheets) {
        const rules = Array.from(stylesheet.rules || stylesheet.cssRules);

        for (const rule of rules) {
            if (element.matches(rule.selectorText)) {
                allRules.push(rule.cssText);
            }
        }
    }

    return allRules;
}

export default getMatchedCSSRules;
export { getMatchedCSSRules };
