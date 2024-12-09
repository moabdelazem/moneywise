"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Eye, EyeOff, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

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
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .transform((value) => value.toLowerCase()),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    setLoginError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        document.cookie = `token=${data.token}; path=/; max-age=86400; secure; samesite=strict`;

        toast({
          title: "Success",
          description: "You have successfully logged in.",
        });

        router.push("/dashboard");
      } else {
        setLoginError(
          data.error || "Invalid email or password. Please try again."
        );
      }
    } catch (error) {
      setLoginError("An unexpected error occurred. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen mx-auto bg-gradient-to-b from-primary/20 via-background to-background">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4 sm:px-0"
      >
        <Card className="shadow-lg border-primary/10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-center">
              Welcome back
            </CardTitle>
            <CardDescription className="text-center text-base">
              Enter your credentials to access your MoneyWise account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AnimatePresence mode="wait">
              {loginError && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Alert variant="destructive">
                    <AlertDescription>{loginError}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="you@example.com"
                          {...field}
                          className="bg-background"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                            className="bg-background pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                              {showPassword ? "Hide password" : "Show password"}
                            </span>
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-center"
                    >
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Logging in...
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-center"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Log in
                    </motion.div>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col items-center justify-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </Link>
            </p>
            <Link
              href="/forgot-password"
              className="text-sm text-muted-foreground hover:underline"
            >
              Forgot your password?
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}