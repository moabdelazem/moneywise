import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface ExpenseDistributionProps {
  pieChartData: Array<{ name: string; value: number }>;
  COLORS: string[];
  chartConfig: any;
  hoveredCategory: string | null;
  setHoveredCategory: (category: string | null) => void;
}

export function ExpenseDistribution({
  pieChartData,
  COLORS,
  chartConfig,
  hoveredCategory,
  setHoveredCategory,
}: ExpenseDistributionProps) {
  return (
    <div className="bg-card p-6 rounded-xl shadow-sm">
      <h3 className="text-xl font-bold mb-4 text-foreground">
        Expense Distribution
      </h3>
      <ChartContainer config={chartConfig} className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
              paddingAngle={2}
              onMouseEnter={(_, index) =>
                setHoveredCategory(pieChartData[index].name)
              }
              onMouseLeave={() => setHoveredCategory(null)}
            >
              {pieChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  opacity={
                    hoveredCategory === null || hoveredCategory === entry.name
                      ? 1
                      : 0.3
                  }
                  className="transition-opacity duration-300"
                />
              ))}
            </Pie>
            <ChartTooltip
              content={<ChartTooltipContent />}
              wrapperClassName="bg-popover text-popover-foreground shadow-lg rounded-lg p-2"
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {pieChartData.map((entry, index) => (
          <div
            key={`legend-${index}`}
            className="flex items-center bg-background p-2 rounded-lg shadow-sm cursor-pointer transition-colors duration-200 hover:bg-accent"
            onMouseEnter={() => setHoveredCategory(entry.name)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <div
              className="w-4 h-4 rounded-full mr-3"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-sm font-medium text-foreground">
              {entry.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
