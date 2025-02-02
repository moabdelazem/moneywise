"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  PiggyBank,
  BarChart2,
  Target,
  CheckCircle,
  Sparkles,
  Wallet,
  TrendingUp,
  Sun,
  Moon,
  Laptop,
  Star,
} from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Features of the app in the home page
const features = [
  {
    title: "Smart Expense Tracking",
    description: "Automatically categorize and analyze your spending patterns.",
    icon: BarChart2,
  },
  {
    title: "Intelligent Budgeting",
    description:
      "AI-powered budget recommendations based on your spending habits.",
    icon: PiggyBank,
  },
  {
    title: "Goal Achievement",
    description: "Visual progress tracking with milestone celebrations.",
    icon: Target,
  },
  {
    title: "Real-time Insights",
    description: "Get instant notifications and spending alerts.",
    icon: TrendingUp,
  },
  {
    title: "Smart Savings",
    description: "Automated savings suggestions and investment tips.",
    icon: Wallet,
  },
];

// Enhanced Framer Motion animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

// Animation for the features
const itemVariants = {
  hidden: { y: 50, opacity: 0, scale: 0.9 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15,
    },
  },
};

export default function Home() {
  // Theme toggle function
  const { setTheme } = useTheme();

  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none backdrop-blur-3xl" />
        <div className="absolute top-6 right-6 z-50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full backdrop-blur-sm"
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="rounded-xl backdrop-blur-md"
            >
              <DropdownMenuItem
                onClick={() => setTheme("light")}
                className="rounded-lg"
              >
                <Sun className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("dark")}
                className="rounded-lg"
              >
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("system")}
                className="rounded-lg"
              >
                <Laptop className="mr-2 h-4 w-4" />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <motion.div
          className="container px-8 py-24 mx-auto lg:px-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="flex flex-col items-center justify-center gap-20 text-center">
            <motion.div
              className="flex flex-col items-center w-full max-w-6xl"
              variants={itemVariants}
            >
              <div className="relative mb-6">
                <motion.div
                  className="absolute -inset-2 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-2xl blur-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                  }}
                />
                <span className="relative px-6 py-3 text-sm font-medium text-primary bg-primary/10 rounded-full backdrop-blur-sm">
                  🚀 Welcome to the Future of Finance
                </span>
              </div>
              <h1 className="text-7xl font-black tracking-tighter sm:text-8xl lg:text-9xl mb-12 bg-gradient-to-r from-orange-500 via-orange-400 to-secondary bg-clip-text text-transparent">
                Money
                <span className="relative mx-3 text-primary">
                  Wise
                  <motion.span
                    className="absolute -top-10 -right-10 text-yellow-400"
                    animate={{
                      rotate: [0, 25, 0],
                      scale: [1, 1.3, 1],
                    }}
                    transition={{ repeat: Infinity, duration: 4 }}
                  >
                    <Sparkles className="w-12 h-12" />
                  </motion.span>
                </span>
              </h1>
              <p className="text-2xl text-muted-foreground max-w-4xl mb-12 leading-relaxed font-medium">
                Experience the next generation of financial management with our
                AI-powered budgeting tools and intelligent insights.
              </p>
              <motion.div
                className="flex flex-col sm:flex-row gap-8 mt-6"
                variants={itemVariants}
              >
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto group px-10 py-7 text-lg hover:scale-105 transition-all duration-500 shadow-xl hover:shadow-primary/30 rounded-2xl"
                >
                  <Link href="/signup" className="flex items-center">
                    Get Started Now
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-3" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto px-10 py-7 text-lg hover:bg-secondary/50 transition-all duration-500 rounded-2xl backdrop-blur-sm"
                >
                  <Link href="/login">Sign In</Link>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-7xl mt-16"
              variants={containerVariants}
            >
              {features.map((feature, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 bg-gradient-to-br from-background via-secondary/5 to-primary/5 border border-secondary/20 group rounded-3xl backdrop-blur-sm">
                    <CardHeader>
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        className="mb-6 text-primary bg-primary/10 p-5 rounded-2xl w-fit group-hover:bg-primary/20 transition-colors duration-500"
                      >
                        <feature.icon className="h-10 w-10" />
                      </motion.div>
                      <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors duration-500">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg text-muted-foreground leading-relaxed">
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
      <footer className="py-16 text-center text-base text-muted-foreground bg-secondary/5 backdrop-blur-sm">
        <motion.div
          className="container mx-auto px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <a
            href="https://github.com/moabdelazem/moneywise"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 hover:scale-105 mb-8 text-lg font-medium transition-all duration-500 bg-primary/5 px-6 py-3 rounded-full"
          >
            <Star className="h-5 w-5" />
            Star us on GitHub - We &apos; re Open Source!
          </a>
          <div className="flex items-center justify-center gap-4 text-lg">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <span>
              Crafted with ❤️ by Mohamed Abdelazem, Monica Nader, Malak Ayman,
              and Rawan Medhat
            </span>
          </div>
        </motion.div>
      </footer>
    </>
  );
}
