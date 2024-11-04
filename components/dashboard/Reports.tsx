import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MotionCard = motion(Card);

export function Reports() {
  return (
    <MotionCard
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Financial Reports
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-400">
          Financial reports and analytics will be available here soon.
        </p>
      </CardContent>
    </MotionCard>
  );
}
