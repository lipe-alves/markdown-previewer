import getComputedStyle from "./getComputedStyle";
import toNumber from "./toNumber";

function matchScrollHeights(element1: HTMLElement, element2: HTMLElement) {
    element1.style.boxSizing = "content-box";
    element2.style.boxSizing = "content-box";

    const element1Data = {
        scrollHeight: element1.scrollHeight,
        paddingTop: toNumber(getComputedStyle(element1, "padding-top")),
        paddingBottom: toNumber(getComputedStyle(element1, "padding-bottom")),
        verticalPadding: 0,
    };

    element1Data.verticalPadding =
        element1Data.paddingTop + element1Data.paddingBottom;

    const element2Data = {
        scrollHeight: element2.scrollHeight,
        paddingTop: toNumber(getComputedStyle(element2, "padding-top")),
        paddingBottom: toNumber(getComputedStyle(element2, "padding-bottom")),
        verticalPadding: 0,
    };

    element2Data.verticalPadding =
        element2Data.paddingTop + element2Data.paddingBottom;

    element2.style.paddingTop = `${element2Data.paddingTop}px`;

    const scrollDifference = Math.abs(
        element1Data.scrollHeight - element2Data.scrollHeight
    );
    const adjustmentPaddingBottom =
        element2Data.paddingBottom + scrollDifference;

    if (element1Data.scrollHeight > element2Data.scrollHeight) {
        element2.style.paddingBottom = `${adjustmentPaddingBottom}px`;
    } else {
        element1.style.paddingBottom = `${adjustmentPaddingBottom}px`;
    }
}

export default matchScrollHeights;
export { matchScrollHeights };
