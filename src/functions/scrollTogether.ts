function scrollTogether(element1: HTMLElement, element2: HTMLElement) {
    const scrollPercentage =
        element1.scrollTop / (element1.scrollHeight - element1.clientHeight);
    element2.scrollTop =
        scrollPercentage * (element2.scrollHeight - element2.clientHeight);
}

export default scrollTogether;
export { scrollTogether };
