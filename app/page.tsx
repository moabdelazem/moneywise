"use client"

import Link from "next/link";
import { Metadata } from "next";
import { motion } from "framer-motion";
import {
  ArrowRight,
  PiggyBank,
  BarChart2,
  Target,
  CheckCircle,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const metadata: Metadata = {
  title: "MoneyWise - Simple Budgeting App",
  description:
    "Track your expenses, set budgets, and achieve your financial goals with MoneyWise.",
  openGraph: {
    title: "MoneyWise - Simple Budgeting App",
    description:
      "Track your expenses, set budgets, and achieve your financial goals with MoneyWise.",
    images: [
      { url: "/og-image.jpg", width: 1200, height: 630, alt: "MoneyWise App" },
    ],
  },
};

const features = [
  {
    title: "Track Expenses",
    description: "Easily log and categorize your daily expenses.",
    icon: BarChart2,
  },
  {
    title: "Set Budgets",
    description: "Create custom budgets for different spending categories.",
    icon: PiggyBank,
  },
  {
    title: "Achieve Goals",
    description: "Set financial goals and track your progress over time.",
    icon: Target,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

export default function Home() {
  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-primary/10 via-background to-background">
        <motion.div
          className="container px-4 py-16 mx-auto sm:px-6 lg:px-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="flex flex-col items-center justify-center gap-12 text-center">
            <motion.div
              className="flex flex-col items-center w-full max-w-4xl"
              variants={itemVariants}
            >
              <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl mb-6">
                Money
                <span className="text-primary relative">
                  Wise
                  <motion.span
                    className="absolute -top-6 -right-6 text-yellow-400"
                    animate={{ rotate: [0, 20, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Sparkles className="w-8 h-8" />
                  </motion.span>
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mb-8">
                A simple and powerful budgeting app that helps you take
                control of your finances and achieve your financial goals.
              </p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 mt-4"
                variants={itemVariants}
              >
                <Button asChild size="lg" className="w-full sm:w-auto group">
                  <Link href="/signup" className="flex items-center">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <Link href="/login">Login</Link>
                </Button>
              </motion.div>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-4xl mt-16"
              variants={containerVariants}
            >
              {features.map((feature, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="transition-all duration-300 hover:shadow-lg overflow-hidden group">
                    <CardHeader>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="mb-2 text-primary"
                      >
                        <feature.icon className="h-12 w-12" />
                      </motion.div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </main>
      <footer className="py-8 text-center text-sm text-muted-foreground ">
        <motion.div
          className="container mx-auto px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="mb-4">
            © {new Date().getFullYear()} MoneyWise. All rights reserved.
          </div>
          <a
            href="https://github.com/moabdelazem/moneywise"
            className="text-primary hover:underline mb-4 inline-block"
          >
            The Project is Free and Open Source - View on GitHub
          </a>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>
              Created with ❤️ by Mohamed Abdelazem, Monica Nader, Malak Ayman, and
              Rawan Medhat
            </span>
          </div>
        </motion.div>
      </footer>
    </>
  );
}