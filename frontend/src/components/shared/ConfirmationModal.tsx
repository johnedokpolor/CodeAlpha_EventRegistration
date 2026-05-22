import { AlertCircle } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDangerous = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full">
        <div className="flex items-start gap-4 p-6">
          {isDangerous && (
            <div className="flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm">{message}</p>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-border">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border text-foreground bg-secondary hover:bg-secondary/80 rounded-lg transition font-medium text-sm"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 rounded-lg transition font-medium text-sm ${
              isDangerous
                ? "bg-destructive border hover:opacity-90"
                : "bg-primary border hover:opacity-90"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
