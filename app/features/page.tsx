"use client";

import { motion } from "framer-motion";
import {
  BarChart2,
  PiggyBank,
  Target,
  TrendingUp,
  Wallet,
  Shield,
  ArrowRight,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";

/**
 * Feature item type definition
 * @typedef {Object} Feature
 * @property {string} title - The feature's title
 * @property {string} description - Detailed description of the feature
 * @property {LucideIcon} icon - Lucide icon component for the feature
 * @property {string} color - Gradient color classes for the feature card
 * @property {string} demo - Call-to-action text for the feature
 */

/**
 * Array of feature items displaying MoneyWise's main functionalities
 * Each feature includes an icon, title, description, and demo text
 */
const features = [
  {
    title: "Smart Expense Tracking",
    description:
      "Automatically categorize your expenses with AI-powered recognition. Get detailed insights into your spending patterns and identify areas for improvement.",
    icon: BarChart2,
    color: "from-blue-500 to-cyan-400",
    demo: "Track every penny with smart categorization",
  },
  {
    title: "Intelligent Budgeting",
    description:
      "Receive personalized budget recommendations based on your spending habits and financial goals. Our AI adapts to your lifestyle.",
    icon: PiggyBank,
    color: "from-green-500 to-emerald-400",
    demo: "Smart budgets that adapt to you",
  },
  {
    title: "Goal Achievement",
    description:
      "Set and track financial goals with visual progress tracking. Celebrate milestones and stay motivated with achievement rewards.",
    icon: Target,
    color: "from-purple-500 to-pink-400",
    demo: "Visualize your progress",
  },
  {
    title: "Real-time Insights",
    description:
      "Get instant notifications about your spending patterns, unusual transactions, and budget alerts to stay on top of your finances.",
    icon: TrendingUp,
    color: "from-orange-500 to-red-400",
    demo: "Stay informed in real-time",
  },
  {
    title: "Smart Savings",
    description:
      "Discover opportunities to save with AI-powered suggestions. Get personalized investment tips based on your financial profile.",
    icon: Wallet,
    color: "from-teal-500 to-green-400",
    demo: "Maximize your savings",
  },
  {
    title: "Secure Banking",
    description:
      "Bank-grade encryption and security measures to keep your financial data safe and secure. Multi-factor authentication included.",
    icon: Shield,
    color: "from-indigo-500 to-purple-400",
    demo: "Your security is our priority",
  },
];

/**
 * Animation variants for the container
 * Controls the staggered animation of child elements
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

/**
 * Animation variants for individual items
 * Defines the entry animation for each feature card
 */
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

/**
 * FeaturesPage Component
 *
 * Displays a grid of feature cards showcasing MoneyWise's main functionalities.
 * Features:
 * - Animated entry with staggered animations
 * - Responsive grid layout
 * - Interactive cards with hover effects
 * - Call-to-action section
 *
 * @returns {JSX.Element} Rendered features page component
 */
export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/10">
        <div className="container px-4 md:px-6">
          <motion.div
            className="flex flex-col items-center space-y-4 text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="space-y-2 max-w-3xl lg:max-w-4xl xl:max-w-5xl">
              <div className="flex items-center justify-center mb-8">
                <span className="relative px-6 py-3 text-sm font-medium text-primary bg-primary/10 rounded-full backdrop-blur-sm">
                  <Zap className="w-4 h-4 inline-block mr-2" />
                  Powerful Features for Smart Finance
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Everything you need to manage your money
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground text-xl mt-4 lg:max-w-3xl xl:max-w-4xl">
                Discover how MoneyWise makes financial management simple, smart,
                and secure
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16"
              variants={containerVariants}
            >
              {features.map((feature, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="relative border-border overflow-hidden group hover:shadow-xl transition-all duration-500 h-full">
                    <CardHeader>
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                      />
                      <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-500">
                          <feature.icon className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">
                          {feature.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {feature.description}
                      </p>
                      <Button
                        variant="ghost"
                        className="group/button hover:bg-primary/10"
                      >
                        {feature.demo}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/button:translate-x-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="mt-20 text-center">
              <Card className="max-w-2xl mx-auto bg-primary/5 border-primary/20 lg:max-w-3xl xl:max-w-4xl">
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-semibold mb-4">
                    Ready to experience these features?
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Join thousands of users who are already managing their
                    finances smarter with MoneyWise.
                  </p>
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
