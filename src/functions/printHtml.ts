function printHtml(html: string) {
    const printWindow = window.open("", "_blank");
    if (!printWindow) throw new Error("Unable to create window");

    printWindow.document.write(html);
    printWindow.print();
    printWindow.document.close();
}

export default printHtml;
export { printHtml };
