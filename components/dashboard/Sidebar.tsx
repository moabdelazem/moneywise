import { cn } from "@/lib/utils";
import {
  LuLayoutDashboard,
  LuReceipt,
  LuFileText,
  LuChartBar,
  LuChartArea,
  LuSettings,
  LuLogOut,
  LuBell,
  LuBrain, // Import the new icon
} from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  isSidebarOpen: boolean;
  userName: string;
  userEmail: string;
  onLogout: () => void;
}

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    description: "Overview of your finances",
  },
  {
    id: "expenses",
    label: "Expenses",
    icon: LuReceipt,
    description: "Track your spending",
  },
  {
    id: "budgets",
    label: "Budgets",
    icon: LuChartBar,
    description: "Manage your budgets",
  },
  {
    id: "analysis",
    label: "Analysis",
    icon: LuChartArea,
    description: "Financial insights",
  },
  {
    id: "reports",
    label: "Reports",
    icon: LuFileText,
    description: "Generate reports",
  },
  {
    id: "reminders",
    label: "Payment Reminders",
    icon: LuBell,
    description: "Reminders for payments",
  },
  {
    id: "analyze-with-ai",
    label: "Analyze with AI",
    icon: LuBrain,
    description: "Leverage AI for analysis",
  },
];

export function Sidebar({
  activeView,
  onViewChange,
  isSidebarOpen,
  userName,
  userEmail,
  onLogout,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 h-screen w-64 bg-card border-border border-r",
        "transform transition-transform duration-300 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        "md:relative md:translate-x-0 md:flex md:flex-col md:w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <div
          className={cn(
            "p-6 border-b border-border flex items-center gap-3"
          )}
        >
          <Avatar className="h-10 w-10 border-2 border-border">
            <AvatarImage src="/avatars/01.png" alt={userName} />
            <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-xs text-muted-foreground truncate">
              {userEmail}
            </p>
          </div>
        </div>

        <div className="flex-1 p-6">
          <nav className="space-y-2">
            {menuItems.map(({ id, label, icon: Icon, description }) => (
              <button
                key={id}
                onClick={() => onViewChange(id)}
                className={cn(
                  "flex items-center w-full rounded-lg transition-colors p-3",
                  "hover:bg-primary/10 hover:text-accent-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  "disabled:pointer-events-none disabled:opacity-50",
                  activeView === id
                    ? "bg-primary/20 text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <div className="flex flex-col items-start ml-3">
                  <span className="text-sm font-medium leading-none">
                    {label}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {description}
                  </span>
                </div>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-border">
          <div className="space-y-2">
            <button
              onClick={() => onViewChange("settings")}
              className={cn(
                "flex items-center w-full rounded-lg p-3 transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                activeView === "settings"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              <LuSettings className="h-5 w-5 shrink-0" />
              <span className="ml-3 text-sm">Settings</span>
            </button>
            <button
              onClick={onLogout}
              className={cn(
                "flex items-center w-full rounded-lg p-3 transition-colors",
                "hover:bg-destructive hover:text-destructive-foreground",
                "text-muted-foreground"
              )}
            >
              <LuLogOut className="h-5 w-5 shrink-0" />
              <span className="ml-3 text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
