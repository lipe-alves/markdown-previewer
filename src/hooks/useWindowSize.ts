import { useState, useLayoutEffect } from "react";

type Size = [width: number, height: number];

/** Returns the window's width and height */
function useWindowSize() {
    const [size, setSize] = useState<Size>([0, 0]);

    const updateSize = () => {
        setSize([window.innerWidth, window.innerHeight]);
    };

    useLayoutEffect(() => {
        window.addEventListener("resize", updateSize);
        updateSize();
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    return size;
}

export default useWindowSize;
export { useWindowSize };
