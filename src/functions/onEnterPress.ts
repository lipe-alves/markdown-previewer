function onEnterPress(
    onEnterPress: (evt: React.KeyboardEvent<HTMLInputElement>) => void
) {
    return (evt: React.KeyboardEvent<HTMLInputElement>) => {
        const code =
            evt.key || evt.code || evt.keyCode || evt.which || evt.charCode;

        if (code == 13 || code === "Enter") {
            onEnterPress(evt);
        }
    };
}

export default onEnterPress;
export { onEnterPress };
