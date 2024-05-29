function downloadFile(file: File): Promise<HTMLAnchorElement> {
    return new Promise<HTMLAnchorElement>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result !== "string") return;

            const dataUrl = reader.result;
            const a = document.createElement("a");

            a.setAttribute("href", dataUrl);
            a.setAttribute("download", file.name);
            a.click();

            resolve(a);
        };

        reader.onerror = reject;

        reader.readAsDataURL(file);
    });
}

export default downloadFile;
export { downloadFile };
