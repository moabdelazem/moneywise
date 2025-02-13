import { cn } from "@/lib/utils";
import {
  LuLayoutDashboard,
  LuReceipt,
  LuFileText,
  LuChevronLeft,
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
  onToggleSidebar: () => void;
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
  onToggleSidebar,
  userName,
  userEmail,
  onLogout,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "bg-card border-border border-r transition-all duration-300 ease-in-out relative flex flex-col",
        isSidebarOpen ? "w-64" : "w-20"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute border-border -right-4 top-6 h-8 w-8 rounded-full border bg-background"
        onClick={onToggleSidebar}
      >
        <LuChevronLeft
          className={cn(
            "h-4 w-4 transition-transform",
            isSidebarOpen ? "" : "rotate-180"
          )}
        />
      </Button>

      <div className="flex flex-col h-full">
        {/* User Info Section */}
        <div
          className={cn(
            "p-6 border-b border-border",
            isSidebarOpen ? "flex items-center gap-3" : "flex justify-center"
          )}
        >
          <Avatar className="h-10 w-10 border-2 border-border">
            <AvatarImage src="/avatars/01.png" alt={userName} />
            <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
          </Avatar>
          {isSidebarOpen && (
            <div className="flex flex-col overflow-hidden">
              <p className="text-sm font-medium truncate">{userName}</p>
              <p className="text-xs text-muted-foreground truncate">
                {userEmail}
              </p>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 p-6">
          <nav className="space-y-2">
            {menuItems.map(({ id, label, icon: Icon, description }) => (
              <button
                key={id}
                onClick={() => onViewChange(id)}
                className={cn(
                  "flex items-center w-full rounded-lg transition-colors",
                  "hover:bg-primary/10 hover:text-accent-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  "disabled:pointer-events-none disabled:opacity-50",
                  activeView === id
                    ? "bg-primary/20 text-accent-foreground"
                    : "text-muted-foreground",
                  isSidebarOpen ? "p-3" : "p-3 justify-center"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {isSidebarOpen && (
                  <div className="flex flex-col items-start ml-3">
                    <span className="text-sm font-medium leading-none">
                      {label}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {description}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Profile Menu Section */}
        <div className="p-4 border-t border-border">
          <div className="space-y-2">
            <button
              onClick={() => onViewChange("settings")}
              className={cn(
                "flex items-center w-full rounded-lg p-3 transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                activeView === "settings"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground",
                !isSidebarOpen && "justify-center"
              )}
            >
              <LuSettings className="h-5 w-5 shrink-0" />
              {isSidebarOpen && <span className="ml-3 text-sm">Settings</span>}
            </button>
            <button
              onClick={onLogout}
              className={cn(
                "flex items-center w-full rounded-lg p-3 transition-colors",
                "hover:bg-destructive hover:text-destructive-foreground",
                "text-muted-foreground",
                !isSidebarOpen && "justify-center"
              )}
            >
              <LuLogOut className="h-5 w-5 shrink-0" />
              {isSidebarOpen && <span className="ml-3 text-sm">Logout</span>}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
