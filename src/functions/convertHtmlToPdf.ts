import convertHtmlToCanvas from "./convertHtmlToCanvas";
import convertCanvasToPdf from "./convertCanvasToPdf";

async function convertHtmlToPdf(
    html: string,
    filename: string
): Promise<File | undefined> {
    const canvas = await convertHtmlToCanvas(html);
    if (!canvas) return undefined;

    const file = await convertCanvasToPdf(canvas, filename);
    return file;
}

export default convertHtmlToPdf;
export { convertHtmlToPdf };
