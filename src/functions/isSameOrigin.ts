function isSameOrigin(url1: string, url2: string) {
    const urlObj1 = new URL(url1);
    const urlObj2 = new URL(url2);
    return (
        urlObj1.protocol === urlObj2.protocol && urlObj1.host === urlObj2.host
    );
}

export default isSameOrigin;
export { isSameOrigin };
