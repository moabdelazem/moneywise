"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface Savings {
    id: string;
    amount: number;
    description: string;
    createdAt: string;
}

const formSchema = z.object({
    amount: z.string().min(1, "Amount is required"),
    description: z.string(),
});

export default function SavingsPage() {
    const [savings, setSavings] = useState<Savings[]>([]);
    const [error, setError] = useState("");
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: "",
            description: "",
        },
    });

    useEffect(() => {
        fetchSavings();
    }, []);

    const fetchSavings = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }

            const response = await fetch("/api/savings", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch savings");
            }

            const data = await response.json();
            setSavings(data);
        } catch (error) {
            setError("Failed to fetch savings");
            console.error(error);
        }
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }

            const response = await fetch("/api/savings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    amount: parseFloat(values.amount),
                    description: values.description,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to create savings");
            }

            form.reset();
            fetchSavings();
        } catch (error) {
            setError("Failed to create savings");
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }

            const response = await fetch("/api/savings", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                throw new Error("Failed to delete savings");
            }

            fetchSavings();
        } catch (error) {
            setError("Failed to delete savings");
            console.error(error);
        }
    };

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Add New Savings</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="flex gap-4">
                                <FormField
                                    control={form.control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Amount"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem className="flex-[2]">
                                            <FormControl>
                                                <Input
                                                    placeholder="Description"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">Add Savings</Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {error && (
                <Alert variant="destructive" className="my-4">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="space-y-4 mt-4">
                {savings.map((saving) => (
                    <Card key={saving.id}>
                        <CardContent className="flex justify-between items-center p-4">
                            <div>
                                <p className="font-bold text-lg">${saving.amount.toFixed(2)}</p>
                                <p className="text-muted-foreground">{saving.description}</p>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(saving.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <Button
                                variant="destructive"
                                onClick={() => handleDelete(saving.id)}
                                size="sm"
                            >
                                Delete
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
