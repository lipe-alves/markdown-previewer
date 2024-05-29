import React from "react";
import styles from "./styles.module.scss";

interface HamburgerProps {
    open: boolean;
    onOpen?: (evt: React.ChangeEvent<HTMLInputElement>) => void;
    onClose?: (evt: React.ChangeEvent<HTMLInputElement>) => void;
    onToggle?: (evt: React.ChangeEvent<HTMLInputElement>) => void;
    children: React.ReactNode;
}

function Hamburger(props: HamburgerProps) {
    const { open, onOpen, onClose, onToggle, children } = props;

    const handleToggle = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const checked = evt.target.checked;
        if (checked && onOpen) onOpen(evt);
        if (!checked && onClose) onClose(evt);
        if (onToggle) onToggle(evt);
    };

    return (
        <div
            className={styles.Hamburger}
            data-open={open}
        >
            <input
                id="hamburger-toggle"
                className={styles.HamburgerToggle}
                type="checkbox"
                onChange={handleToggle}
                checked={open}
            />
            <label
                className={styles.HamburgerButtonContainer}
                htmlFor="hamburger-toggle"
            >
                <div className={styles.HamburgerButton} />
            </label>
            <ul className={styles.HamburgerMenu}>
                <li>One</li>
                <li>Two</li>
                <li>Three</li>
                <li>Four</li>
                <li>Five</li>
            </ul>
        </div>
    );
}

export default Hamburger;
export { Hamburger };
export type { HamburgerProps };
