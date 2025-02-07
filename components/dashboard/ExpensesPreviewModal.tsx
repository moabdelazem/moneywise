import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExpensesList } from "./ExpensesList";
import { Expense } from "@/lib/types";

interface ExpensesPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
}

export function ExpensesPreviewModal({
  isOpen,
  onClose,
  expenses,
}: ExpensesPreviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl border-border h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Expense History
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden py-4">
          <ExpensesList expenses={expenses} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
