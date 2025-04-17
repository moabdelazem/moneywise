import Link from "next/link";
import { Button } from "./ui/button";
import { Github, Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-lg">
      <div className="container flex flex-col items-center justify-center gap-4 py-10 md:flex-row md:justify-around md:h-24 md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with{" "}
            <Heart className="inline-block w-4 h-4 text-red-500 animate-pulse" />{" "}
            by{" "}
            <Link
              href="https://github.com/moabdelazem"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              MoneyWise Team
            </Link>{" "}
            © {currentYear}
          </p>
        </div>
        <Button variant="ghost" size="icon" asChild>
          <Link
            href="https://github.com/moabdelazem/moneywise"
            target="_blank"
            rel="noreferrer"
          >
            <Github className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </footer>
  );
}
