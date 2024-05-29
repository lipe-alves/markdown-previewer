import { useState } from "react";
import useAsyncEffect from "./useAsyncEffect";

function useAsyncMemo<T>(
    asyncCallback: () => Promise<T>,
    dependencies: any[] = [],
    initialValue: T
) {
    const [value, setValue] = useState<T>(initialValue);

    useAsyncEffect(async () => {
        const value = await asyncCallback();
        setValue(value);
    }, dependencies);

    return value;
}

export default useAsyncMemo;
export { useAsyncMemo };
