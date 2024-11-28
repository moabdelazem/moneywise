import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, Settings, LogOut } from "lucide-react";

// Sidebar Props Type
interface SidebarProps {
  userName: string;
  activeView: string;
  setActiveView: (
    view: "dashboard" | "expenses" | "budgets" | "reports"
  ) => void;
  handleLogout: () => void;
}

export function Sidebar({
  userName,
  setActiveView,
  handleLogout,
}: SidebarProps) {
  // Router hook to navigate between pages
  const router = useRouter();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 left-4 z-50"
        >
          <Home className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Moneywise</SheetTitle>
          <SheetDescription>
            Keep track of your expenses and budgets
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="flex items-center space-x-4 mb-6 pb-6 border-b dark:border-gray-700">
            <Avatar>
              <AvatarImage
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${userName}`}
                alt={userName}
              />
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{userName}</p>
              <p className="text-sm text-muted-foreground">
                {userName.split(" ").join("").toLowerCase()}@email.com
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => setActiveView("dashboard")}
          >
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => router.push("/profile")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Profile Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => router.push("/settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
