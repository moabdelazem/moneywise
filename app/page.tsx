"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  PiggyBank,
  BarChart2,
  Target,
  Sparkles,
  Wallet,
  TrendingUp,
  Star,
  Github,
  Linkedin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { PageTransition } from "@/components/page-transition";
import { Footer } from "@/components/footer";

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

// List of creators with their information
const creators = [
  {
    name: "Mohamed Abdelazem",
    role: "Lead Developer",
    github: "https://github.com/moabdelazem",
    linkedin: "https://linkedin.com/in/moabdelazem",
  },
  {
    name: "Monica Nader",
    role: "Developer",
    github: "https://github.com/monicanader",
    linkedin: "https://linkedin.com/in/monicanader",
  },
  {
    name: "Malak Ayman",
    role: "Designer",
    github: "https://github.com/malakayman",
    linkedin: "https://linkedin.com/in/malakayman",
  },
  {
    name: "Rawan Medhat",
    role: "Designer",
    github: "https://github.com/rawanmedhat",
    linkedin: "https://linkedin.com/in/rawanmedhat",
  },
];

export default function Home() {
  const expenses = [
    // Example expenses data
    { date: "2023-10-01", amount: 50, category: "Food" },
    { date: "2023-10-02", amount: 20, category: "Transport" },
    // Add more expenses as needed
  ];

  const budgets = [
    // Example budgets data
    { category: "Food", amount: 300 },
    { category: "Transport", amount: 100 },
    // Add more budgets as needed
  ];

  return (
    <PageTransition>
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 px-4 sm:px-8">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none backdrop-blur-3xl" />
        <motion.div
          className="container px-4 sm:px-8 py-24 mx-auto lg:px-12 mt-16"
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
              <h1 className="text-6xl font-black tracking-tighter sm:text-8xl lg:text-9xl mb-12 bg-gradient-to-r from-orange-500 via-orange-400 to-secondary bg-clip-text text-transparent">
                Smart
                <span className="relative mx-3 text-primary">
                  Money
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
                Moves
              </h1>
              <p className="text-xl text-muted-foreground max-w-4xl mb-12 leading-relaxed font-medium sm:text-2xl">
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
                    Join Us Now
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 w-full max-w-7xl mt-16"
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

            {/* Meet the Creators Section */}
            <motion.div
              className="container py-12 sm:py-24"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="text-center mb-16">
                <span className="relative px-6 py-3 text-sm font-medium text-primary bg-primary/10 rounded-full backdrop-blur-sm">
                  👥 Meet the Team
                </span>
                <h2 className="text-4xl font-bold mt-6">
                  The Creators Behind MoneyWise
                </h2>
                <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
                  Meet our talented team of developers and designers who are
                  passionate about making financial management accessible to
                  everyone.
                </p>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
                variants={containerVariants}
              >
                {creators.map((creator) => (
                  <motion.div
                    key={creator.name}
                    variants={itemVariants}
                    className="text-center"
                  >
                    <Card className="overflow-hidden backdrop-blur-sm hover:shadow-xl transition-all duration-500 border-border">
                      <CardHeader className="relative pb-0"></CardHeader>
                      <CardContent className="pt-4">
                        <h3 className="text-xl font-semibold">
                          {creator.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {creator.role}
                        </p>
                        <div className="flex items-center justify-center gap-4">
                          <Button variant="ghost" size="icon" asChild>
                            <a
                              href={creator.github}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Github className="w-5 h-5" />
                            </a>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <a
                              href={creator.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Linkedin className="w-5 h-5" />
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Open Source Section */}
            <motion.div
              className="w-full max-w-5xl mt-16 sm:mt-32 text-center"
              variants={containerVariants}
            >
              <motion.div
                className="relative inline-block mb-8"
                variants={itemVariants}
              >
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
                  💻 Open Source Project
                </span>
              </motion.div>
              <motion.h2
                className="text-4xl font-bold mb-6"
                variants={itemVariants}
              >
                Built in Public, For the Community
              </motion.h2>
              <motion.p
                className="text-xl text-muted-foreground mb-8"
                variants={itemVariants}
              >
                MoneyWise is proudly open source. We believe in transparency and
                community-driven development. Join us in building the future of
                personal finance management.
              </motion.p>
              <motion.div variants={itemVariants} className="md:block">
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="group px-8 py-6 text-lg hover:scale-105 transition-all duration-500 rounded-2xl backdrop-blur-sm"
                >
                  <a
                    href="https://github.com/moabdelazem/moneywise"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Star className="w-5 h-5" />
                    Star us on GitHub
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-3" />
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </PageTransition>
  );
}
