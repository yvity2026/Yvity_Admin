"use client";

import { useCallback, useRef, useState } from "react";
import AdminButton from "./AdminButton";
import AdminModal from "./AdminModal";

/**
 * Branded confirmation dialog (replaces window.confirm).
 * Set requireReason to show an optional/required reason textarea.
 */
export default function AdminConfirmDialog({
  open,
  title = "Confirm action",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  loading = false,
  requireReason = false,
  reasonLabel = "Reason (optional)",
  reason = "",
  onReasonChange,
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
      {requireReason && (
        <textarea
          className="mt-3 w-full rounded-xl border border-[#E6ECEA] px-3 py-2 text-sm text-[#183534] placeholder-[#9AB0AB] outline-none focus:border-[#0A4A4A] resize-none"
          rows={3}
          placeholder={reasonLabel}
          value={reason}
          onChange={(e) => onReasonChange?.(e.target.value)}
        />
      )}
    </AdminModal>
  );
}

/**
 * Promise-based confirm helper.
 * Resolves { confirmed: boolean, reason: string }.
 *
 * const { confirm, dialogProps } = useConfirmDialog();
 * const { confirmed, reason } = await confirm({ title, message, requireReason: true });
 */
export function useConfirmDialog() {
  // Store the Promise resolver in a ref, not in state.
  // Storing functions in state with reactCompiler enabled triggers
  // "Can't perform a React state update on a component that hasn't mounted yet"
  // because the compiler treats function-typed state as a side-effect.
  const resolveRef = useRef(null);

  const [state, setState] = useState({
    open: false,
    title: "",
    message: "",
    confirmLabel: "Confirm",
    cancelLabel: "Cancel",
    variant: "danger",
    requireReason: false,
    reasonLabel: "Reason (optional)",
    reason: "",
  });

  const confirm = useCallback(
    ({
      title = "Confirm action",
      message = "Are you sure?",
      confirmLabel = "Confirm",
      cancelLabel = "Cancel",
      variant = "danger",
      requireReason = false,
      reasonLabel = "Reason (optional)",
    } = {}) =>
      new Promise((resolve) => {
        resolveRef.current = resolve;
        setState({
          open: true,
          title,
          message,
          confirmLabel,
          cancelLabel,
          variant,
          requireReason,
          reasonLabel,
          reason: "",
        });
      }),
    [],
  );

  const handleCancel = useCallback(() => {
    resolveRef.current?.({ confirmed: false, reason: "" });
    resolveRef.current = null;
    setState((current) => ({ ...current, open: false }));
  }, []);

  const handleConfirm = useCallback(() => {
    setState((current) => {
      resolveRef.current?.({ confirmed: true, reason: current.reason });
      resolveRef.current = null;
      return { ...current, open: false };
    });
  }, []);

  const handleReasonChange = useCallback((value) => {
    setState((current) => ({ ...current, reason: value }));
  }, []);

  return {
    confirm,
    dialogProps: {
      open: state.open,
      title: state.title,
      message: state.message,
      confirmLabel: state.confirmLabel,
      cancelLabel: state.cancelLabel,
      variant: state.variant,
      requireReason: state.requireReason,
      reasonLabel: state.reasonLabel,
      reason: state.reason,
      onReasonChange: handleReasonChange,
      onConfirm: handleConfirm,
      onCancel: handleCancel,
    },
  };
}
