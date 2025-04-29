"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { memo, useCallback } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

export const Navbar = memo(function Navbar() {
  const { setTheme } = useTheme();
  const pathname = usePathname();

  // Memoize isActivePath to avoid unnecessary recalculations
  const isActivePath = useCallback(
    (path: string) => {
      if (path === "/" && pathname !== "/") return false;
      return pathname?.startsWith(path);
    },
    [pathname]
  );

  // Theme handlers to avoid inline functions
  const handleThemeLight = useCallback(() => setTheme("light"), [setTheme]);
  const handleThemeDark = useCallback(() => setTheme("dark"), [setTheme]);
  const handleThemeSystem = useCallback(() => setTheme("system"), [setTheme]);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Optimized: Only one animated background blob, lower frequency */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <motion.div
          className="absolute -top-16 -left-24 w-72 h-72 rounded-full bg-primary/20 blur-3xl"
          animate={{ x: [0, 20, 0], y: [0, 20, 0] }}
          transition={{ duration: 18, repeat: Infinity }}
        />
      </div>
      <div className="container flex items-center justify-between h-16 px-4 relative">
        <Link
          href="/"
          className="text-2xl font-extrabold bg-gradient-to-r from-primary via-orange-400 to-secondary bg-clip-text text-transparent drop-shadow-md tracking-tight hover:scale-105 transition-transform"
        >
          MoneyWise
        </Link>

        <div className="flex items-center gap-6">
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-base font-semibold transition-colors relative px-2 py-1
                ${
                  pathname === "/"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }
                ${
                  pathname === "/"
                    ? "after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-1 after:bg-primary/30 after:rounded-full after:animate-pulse"
                    : ""
                }
              `}
            >
              Home
            </Link>
            <Link
              href="/features"
              className={`text-base font-semibold transition-colors relative px-2 py-1
                ${
                  isActivePath("/features")
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }
                ${
                  isActivePath("/features")
                    ? "after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-1 after:bg-primary/30 after:rounded-full after:animate-pulse"
                    : ""
                }
              `}
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className={`text-base font-semibold transition-colors relative px-2 py-1
                ${
                  isActivePath("/pricing")
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }
                ${
                  isActivePath("/pricing")
                    ? "after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-1 after:bg-primary/30 after:rounded-full after:animate-pulse"
                    : ""
                }
              `}
            >
              Pricing
            </Link>
            <Link
              href="https://github.com/moabdelazem/moneywise"
              className="text-base font-semibold text-muted-foreground hover:text-primary transition-colors px-2 py-1"
            >
              GitHub
            </Link>
          </nav>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-menu"
                  >
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                  </svg>
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetTitle></SheetTitle>
              <SheetContent
                side="left"
                className="p-0 w-64 bg-background/95 backdrop-blur-lg"
              >
                <div className="flex flex-col h-full">
                  <Link
                    href="/"
                    className="text-2xl font-extrabold bg-gradient-to-r from-primary via-orange-400 to-secondary bg-clip-text text-transparent drop-shadow-md tracking-tight px-6 py-6"
                  >
                    MoneyWise
                  </Link>
                  <nav className="flex flex-col gap-2 px-6 mt-4">
                    <Link
                      href="/"
                      className={`py-2 px-2 rounded-lg text-base font-semibold transition-colors ${
                        pathname === "/"
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      Home
                    </Link>
                    <Link
                      href="/features"
                      className={`py-2 px-2 rounded-lg text-base font-semibold transition-colors ${
                        isActivePath("/features")
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      Features
                    </Link>
                    <Link
                      href="/pricing"
                      className={`py-2 px-2 rounded-lg text-base font-semibold transition-colors ${
                        isActivePath("/pricing")
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      Pricing
                    </Link>
                    <Link
                      href="https://github.com/moabdelazem/moneywise"
                      className="py-2 px-2 rounded-lg text-base font-semibold text-muted-foreground hover:text-primary transition-colors"
                    >
                      GitHub
                    </Link>
                  </nav>
                  <div className="flex flex-col gap-3 px-6 mt-8">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full rounded-xl"
                    >
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button
                      asChild
                      className="w-full rounded-xl shadow-lg hover:shadow-primary/30 hover:ring-4 hover:ring-primary/20 transition-all"
                    >
                      <Link href="/signup">Join Us</Link>
                    </Button>
                  </div>
                  <div className="px-6 mt-8 mb-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full w-10 h-10"
                      onClick={handleThemeLight}
                    >
                      <Sun className="h-5 w-5" />
                      <span className="sr-only">Light</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full w-10 h-10 ml-2"
                      onClick={handleThemeDark}
                    >
                      <Moon className="h-5 w-5" />
                      <span className="sr-only">Dark</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full w-10 h-10 ml-2"
                      onClick={handleThemeSystem}
                    >
                      <Laptop className="h-5 w-5" />
                      <span className="sr-only">System</span>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full relative hover:ring-2 hover:ring-primary/40"
                >
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleThemeLight}>
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleThemeDark}>
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleThemeSystem}>
                  <Laptop className="mr-2 h-4 w-4" />
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button
              asChild
              className="rounded-xl shadow-lg hover:shadow-primary/30 hover:ring-4 hover:ring-primary/20 transition-all"
            >
              <Link href="/signup">Join Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
});
