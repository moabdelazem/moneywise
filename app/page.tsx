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
  PieChart,
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

// Demo features with interactive animations
const demoFeatures = [
  {
    title: "Expense Analytics",
    description: "Watch how our categorizes your expenses in real-time",
    color: "from-blue-500 to-cyan-400",
    demo: (
      <div className="relative h-64 w-full overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-400/10 p-4">
        <motion.div
          className="absolute left-6 top-6 h-20 w-20"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          viewport={{ once: false }}
        >
          <PieChart className="h-20 w-20 text-blue-500" />
        </motion.div>

        <motion.div
          className="absolute right-6 top-6"
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          viewport={{ once: false }}
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <motion.div
                className="h-2 w-24 rounded-full bg-blue-500"
                initial={{ width: 0 }}
                whileInView={{ width: 96 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                viewport={{ once: false }}
              ></motion.div>
              <span className="text-xs font-medium">Groceries (35%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-cyan-400"></div>
              <motion.div
                className="h-2 w-16 rounded-full bg-cyan-400"
                initial={{ width: 0 }}
                whileInView={{ width: 64 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                viewport={{ once: false }}
              ></motion.div>
              <span className="text-xs font-medium">Transport (25%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
              <motion.div
                className="h-2 w-12 rounded-full bg-indigo-500"
                initial={{ width: 0 }}
                whileInView={{ width: 48 }}
                transition={{ delay: 1.1, duration: 0.8 }}
                viewport={{ once: false }}
              ></motion.div>
              <span className="text-xs font-medium">Utilities (20%)</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-6 left-0 right-0 mx-auto flex justify-center"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.5 }}
          viewport={{ once: false }}
        >
          <div className="rounded-lg bg-background/80 px-4 py-2 backdrop-blur-sm">
            <span className="text-sm font-medium">
              Smart insights generated
            </span>
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    title: "Budget Planning",
    description:
      "See how our budgets system helps you plan and allocate your monthly budget",
    color: "from-emerald-500 to-green-400",
    demo: (
      <div className="relative h-64 w-full overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-400/10 p-4">
        {/* Budget Bar Chart */}
        <div className="flex h-full flex-col justify-end gap-2 pt-8">
          <div className="flex items-end justify-around">
            <motion.div
              className="flex w-12 flex-col items-center"
              initial={{ height: 0, opacity: 0 }}
              whileInView={{ height: "auto", opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              viewport={{ once: false }}
            >
              <div className="h-32 w-8 rounded-t-lg bg-emerald-500/80"></div>
              <p className="mt-2 text-xs">Budget</p>
            </motion.div>

            <motion.div
              className="flex w-12 flex-col items-center"
              initial={{ height: 0, opacity: 0 }}
              whileInView={{ height: "auto", opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              viewport={{ once: false }}
            >
              <div className="h-24 w-8 rounded-t-lg bg-emerald-300/80"></div>
              <p className="mt-2 text-xs">Spent</p>
            </motion.div>

            <motion.div
              className="relative flex w-12 flex-col items-center"
              initial={{ height: 0, opacity: 0 }}
              whileInView={{ height: "auto", opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              viewport={{ once: false }}
            >
              <motion.div
                className="absolute -top-16 left-1/2 -translate-x-1/2 rounded-lg bg-background/90 px-2 py-1 shadow-lg"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.3 }}
                viewport={{ once: false }}
              >
                <p className="text-xs font-medium text-emerald-500">
                  Save 25%!
                </p>
              </motion.div>
              <div className="h-8 w-8 rounded-t-lg bg-emerald-100/80"></div>
              <p className="mt-2 text-xs">Left</p>
            </motion.div>
          </div>

          <motion.div
            className="mt-4 rounded-lg bg-background/80 px-4 py-2 text-center backdrop-blur-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            viewport={{ once: false }}
          >
            <span className="text-sm font-medium">
              You&apos;re on track to meet your savings goal!{" "}
            </span>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    title: "Financial Insights & Analysis",
    description:
      "Get personalized recommendations and actionable financial insights",
    color: "from-indigo-500 to-violet-400",
    demo: (
      <div className="relative h-64 w-full overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-400/10 p-4">
        <div className="absolute left-2 right-2 top-2 mb-3 flex items-center justify-between rounded-lg bg-background/60 p-2 backdrop-blur-sm">
          <div className="flex items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <h4 className="ml-2 text-sm font-medium">MoneyWise Assistant</h4>
          </div>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-background/80">
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4 top-16 flex flex-col space-y-3 overflow-hidden">
          <motion.div
            className="w-4/5 rounded-lg rounded-bl-none bg-background/60 p-3 text-sm backdrop-blur-sm"
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            viewport={{ once: false }}
          >
            <p>What category am I spending the most on?</p>
          </motion.div>

          <motion.div
            className="ml-auto w-4/5 rounded-lg rounded-br-none bg-indigo-500/20 p-3 text-sm backdrop-blur-sm"
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            viewport={{ once: false }}
          >
            <p className="font-medium mb-1">
              Your highest spending category is{" "}
              <span className="text-indigo-600">Dining Out</span>: $435 this
              month (32% of total)
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.5 }}
              viewport={{ once: false }}
            >
              <div className="mt-1 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span>Dining Out</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 rounded-full bg-indigo-500"></div>
                    <span>32%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Housing</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-16 rounded-full bg-violet-400"></div>
                    <span>22%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Transportation</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-10 rounded-full bg-indigo-300"></div>
                    <span>15%</span>
                  </div>
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 1.8, duration: 0.3 }}
                  viewport={{ once: false }}
                  className="text-xs mt-2 text-indigo-600 font-medium"
                >
                  Recommendation: Set a $350 dining budget (20% reduction) to
                  increase savings by $85/month.
                </motion.p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute bottom-0 left-0 right-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.5 }}
            viewport={{ once: false }}
          >
            <div className="flex w-full items-center justify-between rounded-lg bg-background/80 px-3 py-1 text-xs backdrop-blur-sm">
              <span className="flex items-center">
                <span className="mr-1 text-indigo-500">✓</span> Based on your
                last 90 days of transactions
              </span>
              <span className="text-indigo-500 font-medium">
                View detailed report →
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    ),
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
  return (
    <PageTransition>
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 px-4 sm:px-8 relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          <motion.div
            className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] rounded-full bg-primary/30 blur-3xl"
            animate={{ x: [0, 50, 0], y: [0, 50, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] rounded-full bg-secondary/30 blur-3xl"
            animate={{ x: [0, -50, 0], y: [0, -50, 0] }}
            transition={{ duration: 12, repeat: Infinity }}
          />
        </div>
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
                  className="w-full sm:w-auto group px-10 py-7 text-lg hover:scale-105 transition-all duration-500 shadow-xl hover:shadow-primary/40 hover:ring-4 hover:ring-primary/30 rounded-2xl"
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
                  <Card className="h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 bg-gradient-to-br from-primary/10 via-background to-secondary/20 border border-secondary/20 group rounded-3xl backdrop-blur-md shadow-lg">
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

            {/* Interactive Feature Demos Section */}
            <motion.div
              className="w-full max-w-7xl py-16 sm:py-24"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="text-center mb-16">
                <span className="relative px-6 py-3 text-sm font-medium text-primary bg-primary/10 rounded-full backdrop-blur-sm">
                  ✨ See It In Action
                </span>
                <h2 className="text-4xl font-bold mt-6">
                  Interactive Feature Demos
                </h2>
                <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
                  Experience how MoneyWise will transform your financial
                  management with these interactive demos. Scroll to watch them
                  in action!
                </p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
                {demoFeatures.map((demo, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex flex-col gap-4"
                    whileHover={{
                      scale: 1.03,
                      transition: { duration: 0.3 },
                    }}
                  >
                    <h3
                      className="text-2xl font-bold  border-1 border-b border-muted pb-2 mb-2 text-left"
                      style={{
                        backgroundImage: `linear-gradient(to right, ${
                          demo.color.split(" ")[1]
                        }, ${demo.color.split(" ").pop()})`,
                      }}
                    >
                      {demo.title}
                    </h3>
                    <p className="text-muted-foreground text-left mb-2">
                      {demo.description}
                    </p>

                    <motion.div
                      className="relative border border-muted rounded-xl mt-4 shadow-lg"
                      whileHover={{
                        boxShadow: `0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)`,
                      }}
                    >
                      {demo.demo}
                    </motion.div>
                  </motion.div>
                ))}
              </div>
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
                      <CardHeader className="relative pb-0">
                        {/* Avatar with initials */}
                        <div className="flex items-center justify-center mb-4">
                          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary shadow-md">
                            {creator.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                        </div>
                      </CardHeader>
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
