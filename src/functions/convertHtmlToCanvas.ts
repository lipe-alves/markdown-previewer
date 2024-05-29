import html2canvas from "html2canvas";
import trimCanvas from "trim-canvas";

function convertHtmlToCanvas(html: string): Promise<HTMLCanvasElement> {
    return new Promise<HTMLCanvasElement>(async (resolve) => {
        const htmlElement = document.createElement("div");

        htmlElement.style.position = "absolute";
        htmlElement.style.top = "0";
        htmlElement.style.left = "0";
        htmlElement.style.width = "fit-content";
        htmlElement.style.height = "fit-content";
        htmlElement.innerHTML = html;

        document.body.appendChild(htmlElement);

        const canvas = await html2canvas(htmlElement);
        document.body.removeChild(htmlElement);
        trimCanvas(canvas);

        resolve(canvas);
    });
}

export default convertHtmlToCanvas;
export { convertHtmlToCanvas };
