import React, { forwardRef } from "react";
import { createPortal } from "react-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  ButtonProps,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";

import { useModal } from "../../providers";

import styles from "./styles.module.scss";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ModalProps {
  visible: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  buttons?: ButtonProps[];
  hide?: () => void;
  variant?: "success" | "error" | "warning" | "info";
  parentElement?: Element | DocumentFragment;
}

function Modal(props: ModalProps) {
  const {
    parentElement,
    visible,
    title,
    description,
    buttons = [],
    hide,
    variant,
  } = props;
  const modal = useModal();

  const handleHide = () => {
    if (!hide) {
      modal.hide();
    } else {
      hide();
    }
  };

  const modalEl = (
    <Dialog
      keepMounted
      open={visible}
      TransitionComponent={Transition}
      onClose={handleHide}
      PaperProps={{
        className: styles.Modal,
        "data-variant": variant,
      }}
      sx={{
        zIndex: 20,
      }}
    >
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>
        {description && (
          <>
            {typeof description === "string" ? (
              <DialogContentText>{description}</DialogContentText>
            ) : (
              description
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        {buttons.map((buttonProps) => (
          <Button {...buttonProps} />
        ))}
      </DialogActions>
    </Dialog>
  );

  return parentElement ? createPortal(modalEl, parentElement) : modalEl;
}

export default Modal;
export { Modal };
export type { ModalProps };
