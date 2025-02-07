"use client";

import { Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navbar } from "@/components/navbar";

const plans = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for getting started with basic financial tracking",
    features: [
      "Basic expense tracking",
      "Monthly budgeting",
      "2 savings goals",
      "Basic reports",
      "Mobile app access",
    ],
    buttonText: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "9.99",
    description: "Enhanced features for serious money management",
    features: [
      "Everything in Free",
      "Unlimited savings goals",
      "AI-powered insights",
      "Custom categories",
      "Bill reminders",
      "Advanced analytics",
      "Priority support",
    ],
    buttonText: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Business",
    price: "19.99",
    description: "For teams and businesses with advanced needs",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Multiple accounts",
      "API access",
      "Custom reports",
      "Dedicated support",
      "Employee cards",
    ],
    buttonText: "Contact Sales",
    popular: false,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-center py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/10">
        <div className="container px-4 md:px-6">
          <motion.div
            className="flex flex-col items-center space-y-4 text-center mb-16"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
                Simple, Transparent Pricing
              </h1>
              <p className="max-w-[900px] text-muted-foreground text-xl">
                Choose the perfect plan for your financial journey. All plans
                include a 14-day free trial.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {plans.map((plan) => (
              <motion.div key={plan.name} variants={itemVariants}>
                <Card
                  className={`relative flex h-full flex-col ${
                    plan.popular ? "border-primary shadow-lg" : ""
                  } backdrop-blur-sm`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-0 right-0 flex justify-center">
                      <span className="bg-primary px-4 py-1 text-sm font-medium text-primary-foreground rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="mt-4 flex items-baseline text-6xl font-bold">
                      ${plan.price}
                      <span className="ml-1 text-xl font-normal text-muted-foreground">
                        /month
                      </span>
                    </div>
                    <p className="mt-4 text-muted-foreground">
                      {plan.description}
                    </p>
                    <ul className="mt-6 space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <Check className="h-5 w-5 text-primary flex-shrink-0" />
                          <span className="ml-3 text-muted-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full group"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.buttonText}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-16 text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="mx-auto max-w-2xl">
              <h2 className="text-2xl font-bold mb-4">Money-Back Guarantee</h2>
              <p className="text-muted-foreground">
                Try MoneyWise risk-free. If you're not completely satisfied
                within the first 30 days, we'll refund your payment in full – no
                questions asked.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
