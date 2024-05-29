function getComputedStyle(element: HTMLElement, cssProperty: string): string {
    return window.getComputedStyle(element, null).getPropertyValue(cssProperty);
}

export default getComputedStyle;
export { getComputedStyle };
