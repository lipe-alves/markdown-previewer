import { jsPDF } from "jspdf";

function convertCanvasToPdf(
    canvas: HTMLCanvasElement,
    filename: string,
    format = "image/png"
): Promise<File | undefined> {
    return new Promise<File | undefined>(async (resolve) => {
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(undefined);

        const isJpg = format.includes("jpg") || format.includes("jpeg");

        const dataUrl = canvas.toDataURL(format, 1.0);
        const pageWidth = window.innerWidth;

        const pdf = new jsPDF({
            format: [pageWidth, canvas.height],
        });

        pdf.addImage({
            imageData: dataUrl,
            format: isJpg ? "JPEG" : "PNG",
            x: 0,
            y: 0,
            width: pageWidth,
            height: canvas.height,
        });

        const blob = pdf.output("blob");
        const file = new File([blob], filename, { type: "application/pdf" });

        resolve(file);
    });
}

export default convertCanvasToPdf;
export { convertCanvasToPdf };
