import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import styles from "./styles.module.scss";

interface SpinnerProps {
    open: boolean;
    onClose: () => void;
}

function Spinner(props: SpinnerProps) {
    const { open, onClose } = props;

    return (
        <Backdrop
            className={styles.Spinner}
            open={open}
            onClick={onClose}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
}

export default Spinner;
export { Spinner };
export type { SpinnerProps };
