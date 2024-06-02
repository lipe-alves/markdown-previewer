import React from "react";
import {
    IconButton,
    Button,
    MenuItem,
    Select,
    SelectChangeEvent,
} from "@mui/material";

interface MenuButtonProps {
    key?: string;
    className: string;
    label: string;
    icon: JSX.Element;
    onClick?: (evt: React.MouseEvent<any>) => void;
    onChange?: (evt: SelectChangeEvent<any>) => void;
    value?: string;
    disabled?: boolean;
    iconButton?: boolean;
    selector?: boolean;
    isMobile?: boolean;
    options?: {
        label: string;
        className: string;
        value: string;
        disabled: boolean;
        icon: JSX.Element;
    }[];
}

function MenuButton(props: MenuButtonProps) {
    const {
        className,
        label,
        icon,
        onClick,
        onChange,
        value,
        disabled = false,
        iconButton = false,
        selector = false,
        isMobile = false,
        options = [],
    } = props;

    let Component: (props: any) => JSX.Element = Button;
    let componentProps: any = {
        className,
        onClick,
        disabled,
        children: (
            <>
                {icon}
                <span>{label}</span>
            </>
        ),
    };

    if (iconButton && !isMobile) {
        Component = IconButton;
        componentProps = {
            className,
            onClick,
            disabled,
            children: icon,
        };
    } else if (selector) {
        Component = Select;
        componentProps = {
            className,
            onChange,
            value,
            disabled,
            children: options.map((option) => (
                <MenuItem
                    key={option.value}
                    className={option.className}
                    value={option.value}
                    disabled={option.disabled}
                >
                    {option.icon}
                    <span>{option.label}</span>
                </MenuItem>
            )),
        };
    }

    if (isMobile && !selector) {
        Component = MenuItem;
    }

    return <Component {...componentProps} />;
}

export default MenuButton;
export type { MenuButtonProps };
