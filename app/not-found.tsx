"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none backdrop-blur-3xl" />

      <motion.div
        className="text-center space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-9xl font-black text-primary"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          404
        </motion.h1>

        <h2 className="text-4xl font-bold tracking-tight">Page Not Found</h2>
        <p className="text-xl text-muted-foreground max-w-[500px] mx-auto">
          Oops! It seems like the page you're looking for has wandered off into
          the financial wilderness.
        </p>

        <div className="flex items-center justify-center gap-4 mt-8">
          <Button asChild variant="default" size="lg" className="gap-2">
            <Link href="/">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="javascript:history.back()">
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Link>
          </Button>
        </div>
      </motion.div>
    </main>
  );
}
