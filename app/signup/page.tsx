"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Loader2,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  UserPlus,
  Home,
} from "lucide-react";
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
import { Progress } from "@/components/ui/progress";

/**
 * Schema for user signup validation
 * @requires name - Minimum 2 characters
 * @requires email - Valid email format (automatically converted to lowercase)
 * @requires password - Minimum 8 characters, must contain uppercase, lowercase, number, and special character
 * @requires confirmPassword - Must match password field
 */
const signupSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z
      .string()
      .email({ message: "Invalid email address" })
      .transform((value) => value.toLowerCase()),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        }
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

/**
 * SignupPage Component
 *
 * A multi-step signup form with client-side validation and animations.
 * Features:
 * - 3-step registration process
 * - Real-time form validation
 * - Password visibility toggle
 * - Animated transitions between steps
 * - Progress indicator
 * - Error handling and display
 *
 * @returns {JSX.Element} Rendered signup page component
 */
export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    setIsLoading(true);
    setSignupError(null);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Your account has been created.",
        });
        router.push("/login");
      } else {
        setSignupError(data.error || "An error occurred. Please try again.");
      }
    } catch {
      setSignupError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none backdrop-blur-3xl" />
      <Button
        asChild
        variant="ghost"
        className="absolute top-4 left-4 text-muted-foreground hover:text-primary"
      >
        <Link href="/" className="flex items-center gap-2">
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
      </Button>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="shadow-2xl border border-primary/10 backdrop-blur-sm bg-background/80">
          <CardHeader className="space-y-1">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <CardTitle className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
                Join MoneyWise
              </CardTitle>
              <CardDescription className="text-base mt-3 text-muted-foreground/90 font-medium">
                Start your journey to financial wisdom today
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Progress
              value={(step / 3) * 100}
              className="w-full h-2 bg-primary/20"
            />
            <AnimatePresence mode="wait">
              {signupError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Alert
                    variant="destructive"
                    className="border-red-500/50 bg-red-500/10"
                  >
                    <AlertDescription>{signupError}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-foreground/90">
                              Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ex: John Doe"
                                {...field}
                                className="bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary/40 transition-colors"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-foreground/90">
                              Email
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="you@example.com"
                                {...field}
                                className="bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary/40 transition-colors"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-foreground/90">
                              Password
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="••••••••"
                                  {...field}
                                  className="bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary/40 transition-colors pr-10"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground transition-colors"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                  <span className="sr-only">
                                    {showPassword
                                      ? "Hide password"
                                      : "Show password"}
                                  </span>
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-foreground/90">
                              Confirm Password
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={
                                    showConfirmPassword ? "text" : "password"
                                  }
                                  placeholder="••••••••"
                                  {...field}
                                  className="bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary/40 transition-colors pr-10"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground transition-colors"
                                  onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                  }
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                  <span className="sr-only">
                                    {showConfirmPassword
                                      ? "Hide password"
                                      : "Show password"}
                                  </span>
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex justify-between pt-4">
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="border-primary/20 hover:bg-primary/10"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  )}
                  {step < 3 ? (
                    <Button
                      type="button"
                      className="ml-auto bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                      onClick={nextStep}
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="ml-auto bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center"
                        >
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating account...
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center"
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Sign up
                        </motion.div>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col items-center justify-center space-y-2">
            <p className="text-sm font-medium text-muted-foreground/80">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
              >
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
