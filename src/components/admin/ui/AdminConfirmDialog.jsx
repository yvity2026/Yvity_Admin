"use client";

import { useCallback, useState } from "react";
import AdminButton from "./AdminButton";
import AdminModal from "./AdminModal";

/**
 * Branded confirmation dialog (replaces window.confirm).
 */
export default function AdminConfirmDialog({
  open,
  title = "Confirm action",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <AdminModal
      open={open}
      onClose={onCancel}
      title={title}
      size="sm"
      footer={
        <div className="flex justify-end gap-2">
          <AdminButton variant="secondary" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </AdminButton>
          <AdminButton variant={variant} onClick={onConfirm} disabled={loading}>
            {loading ? "Working…" : confirmLabel}
          </AdminButton>
        </div>
      }
    >
      <p className="text-sm leading-relaxed text-[#5C7571]">{message}</p>
    </AdminModal>
  );
}

/**
 * Promise-based confirm helper for async actions.
 *
 * const { confirm, dialogProps } = useConfirmDialog();
 * if (await confirm({ title, message })) { ... }
 */
export function useConfirmDialog() {
  const [state, setState] = useState({
    open: false,
    title: "",
    message: "",
    confirmLabel: "Confirm",
    cancelLabel: "Cancel",
    variant: "danger",
    resolve: null,
  });

  const confirm = useCallback(
    ({
      title = "Confirm action",
      message = "Are you sure?",
      confirmLabel = "Confirm",
      cancelLabel = "Cancel",
      variant = "danger",
    } = {}) =>
      new Promise((resolve) => {
        setState({
          open: true,
          title,
          message,
          confirmLabel,
          cancelLabel,
          variant,
          resolve,
        });
      }),
    [],
  );

  const handleCancel = useCallback(() => {
    state.resolve?.(false);
    setState((current) => ({ ...current, open: false, resolve: null }));
  }, [state.resolve]);

  const handleConfirm = useCallback(() => {
    state.resolve?.(true);
    setState((current) => ({ ...current, open: false, resolve: null }));
  }, [state.resolve]);

  return {
    confirm,
    dialogProps: {
      open: state.open,
      title: state.title,
      message: state.message,
      confirmLabel: state.confirmLabel,
      cancelLabel: state.cancelLabel,
      variant: state.variant,
      onConfirm: handleConfirm,
      onCancel: handleCancel,
    },
  };
}
