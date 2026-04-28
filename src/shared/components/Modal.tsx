import { useEffect, type ReactNode } from "react";
import styles from "@/shared/components/Modal.module.css";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  closeDisabled?: boolean;
  children: ReactNode;
};

export function Modal({
  open,
  onClose,
  closeDisabled = false,
  children
}: ModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !closeDisabled) {
        event.preventDefault();
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeDisabled, onClose, open]);

  if (!open) {
    return null;
  }

  function requestClose() {
    if (!closeDisabled) {
      onClose();
    }
  }

  return (
    <div className={styles.backdrop} onClick={requestClose} role="presentation">
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
