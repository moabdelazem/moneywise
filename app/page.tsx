import Link from "next/link";
import { Metadata } from "next";
import {
  ArrowRight,
  PiggyBank,
  BarChart2,
  Target,
  CheckCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
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

export default function Home() {
  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-primary/10 to-background">
        <div className="container px-4 py-16 mx-auto sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-12 text-center sm:text-left">
            <div className="flex flex-col items-center sm:flex-row sm:items-start sm:justify-between w-full max-w-4xl">
              <div className="flex flex-col gap-6 max-w-lg">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                  Money<span className="text-primary">Wise</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  A simple and powerful budgeting app that helps you take
                  control of your finances.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
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
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-4xl mt-16">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="transition-all duration-300 hover:shadow-lg"
                >
                  <CardHeader>
                    <feature.icon className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <footer className="flex flex-col gap-4 py-6 text-center text-sm text-muted-foreground bg-stone-100 dark:bg-stone-900">
        <div>© {new Date().getFullYear()} MoneyWise. All rights reserved.</div>
        <a
          href="https://github.com/moabdelazem/moneywise"
          className="text-primary hover:underline"
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
      </footer>
    </>
  );
}
