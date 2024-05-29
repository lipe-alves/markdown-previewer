import { useEffect, useRef } from "react";

function useAsyncEffect(callback: () => Promise<void>, triggers: any[] = []) {
    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    useEffect(() => {
        callbackRef.current();
    }, [...triggers]);
}

export default useAsyncEffect;
export { useAsyncEffect };
