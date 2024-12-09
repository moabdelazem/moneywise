"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Budget } from "@/lib/types";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
    category: z.string().min(1, "Category is required"),
    amount: z.string().refine(
        (val) => !isNaN(Number(val)) && Number(val) > 0,
        "Amount must be a positive number"
    ),
});

interface AdjustBudgetModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentBudgets: Budget[];
    onBudgetAdjusted: () => void;
}

export function AdjustBudgetModal({
    open,
    onOpenChange,
    currentBudgets,
    onBudgetAdjusted,
}: AdjustBudgetModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            category: "",
            amount: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsSubmitting(true);
            const currentDate = new Date();

            const response = await fetch("/api/budgets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    category: values.category,
                    amount: Number(values.amount),
                    month: currentDate.getMonth() + 1,
                    year: currentDate.getFullYear(),
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to adjust budget");
            }

            toast({
                title: "Budget Adjusted",
                description: "Your budget has been successfully updated.",
            });

            onBudgetAdjusted();
            onOpenChange(false);
            form.reset();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to adjust budget. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Adjust Budget</DialogTitle>
                    <DialogDescription>
                        Modify your monthly budget allocation for different categories.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="FOOD">Food</SelectItem>
                                            <SelectItem value="TRANSPORTATION">Transportation</SelectItem>
                                            <SelectItem value="HOUSING">Housing</SelectItem>
                                            <SelectItem value="UTILITIES">Utilities</SelectItem>
                                            <SelectItem value="ENTERTAINMENT">Entertainment</SelectItem>
                                            <SelectItem value="OTHER">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                                $
                                            </span>
                                            <Input
                                                {...field}
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                placeholder="0.00"
                                                className="pl-7"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
} 