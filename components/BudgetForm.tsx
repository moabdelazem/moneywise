"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

// Budget schema for form validation
const budgetSchema = z.object({
  category: z.string().min(1, { message: "Category is required" }),
  amount: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Amount must be a positive number",
    }),
  month: z
    .string()
    .refine(
      (val) =>
        !isNaN(parseInt(val)) && parseInt(val) >= 1 && parseInt(val) <= 12,
      {
        message: "Month must be between 1 and 12",
      }
    ),
  year: z
    .string()
    .refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 2023, {
      message: "Year must be 2023 or later",
    }),
});

// BudgetFormProps type
type BudgetFormProps = {
  onSubmit: (data: z.infer<typeof budgetSchema>) => void;
  onCancel: () => void;
};

// BudgetForm component
export function BudgetForm({ onSubmit, onCancel }: BudgetFormProps) {
  // State for loading
  const [isLoading, setIsLoading] = useState(false);

  // Form for budget
  const form = useForm<z.infer<typeof budgetSchema>>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      category: "",
      amount: "",
      month: new Date().getMonth() + 1 + "",
      year: new Date().getFullYear() + "",
    },
  });

  // handle the form submission
  const handleSubmit = async (values: z.infer<typeof budgetSchema>) => {
    // set loading to true
    setIsLoading(true);
    try {
      // call the onSubmit function with the form values
      await onSubmit(values);
      // toast the user
      toast({
        title: "Budget set successfully",
        description: `Budget for ${values.category} set to $${values.amount} for ${values.month}/${values.year}`,
      });
      // reset the form
      form.reset();
    } catch {
      toast({
        title: "Error setting budget",
        description:
          "There was an error setting your budget. Please try again.",
        variant: "destructive",
      });
    } finally {
      // set loading to false
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-8 bg-card p-6 rounded-lg shadow mb-8"
        >
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
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Transportation">
                      Transportation
                    </SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
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
                  <Input placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="month"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Month</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a month" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {new Date(0, i).toLocaleString("default", {
                          month: "long",
                        })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Setting Budget..." : "Set Budget"}
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}
