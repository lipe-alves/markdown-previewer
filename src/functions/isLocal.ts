function isLocal() {
    return window.location.href.includes("localhost");
}

export default isLocal;
export { isLocal };
