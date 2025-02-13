import { cn } from "@/lib/utils";
import {
  LuLayoutDashboard,
  LuReceipt,
  LuFileText,
  LuChevronLeft,
  LuChartBar,
  LuChartArea,
} from "react-icons/lu";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
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
];

export function Sidebar({
  activeView,
  onViewChange,
  isSidebarOpen,
  onToggleSidebar,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "bg-card border-border border-r transition-all duration-300 ease-in-out relative",
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

      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map(({ id, label, icon: Icon, description }) => (
            <button
              key={id}
              onClick={() => onViewChange(id)}
              className={cn(
                "flex items-center w-full rounded-lg transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:pointer-events-none disabled:opacity-50",
                activeView === id
                  ? "bg-accent text-accent-foreground"
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
    </aside>
  );
}
