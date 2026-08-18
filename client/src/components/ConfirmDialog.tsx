/**
 * ECO//SIM — Confirmation dialog (v7 production layer)
 * A controlled AlertDialog wrapper for destructive or irreversible actions
 * (reset plan, delete scenario). Flat editorial styling, zero radius.
 */
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  confirmClass?: string;
  onConfirm: () => void;
}

export default function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "Confirm",
  confirmClass = "bg-vermilion text-primary-foreground hover:bg-vermilion/90",
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="rounded-none border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display text-xl tracking-tight">{title}</AlertDialogTitle>
          <AlertDialogDescription className="font-sans text-sm text-muted-foreground">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-none border-border">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className={`rounded-none ${confirmClass}`}>
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
