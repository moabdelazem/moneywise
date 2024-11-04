import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  children: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {children}
      </div>
    </div>
  );
}
