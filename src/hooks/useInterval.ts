import { useRef, useEffect } from "react";

/**
 * The same as setInterval
 * @param callback - The function to be called on every interval, you can also clear the interval inside this function.
 * @param delay - The time interval in milliseconds to execute the function, if null, it clears the interval.
 * @param triggers - If one of these values change, it will restart the interval.
 * @param runOnInit - Run callback at least once on start.
 */
function useInterval(
    callback: (id: string | number | NodeJS.Timeout) => void | Promise<void>,
    delay: number | null,
    triggers: any[] = [],
    runOnInit = false
) {
    const savedCallback = useRef(
        (id: string | number | NodeJS.Timeout) => {
            clearInterval(id);
        }
    );

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if (delay === null) {
            return;
        }

        const id = setInterval(() => {
            savedCallback.current(id);
        }, delay);

        if (runOnInit) {
            savedCallback.current(id);
        }

        return () => clearInterval(id);
    }, [delay, runOnInit, ...triggers]);
}

export default useInterval;
export { useInterval };
