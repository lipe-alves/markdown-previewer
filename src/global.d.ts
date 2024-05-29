declare module "*.scss";

declare module "*.scss" {
    const content: Record<string, string>;
    export default content;
}

declare module "trim-canvas" {
    const trimCanvas: (canvas: HTMLCanvasElement) => void;
    export default trimCanvas;
}
