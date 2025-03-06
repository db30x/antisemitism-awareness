import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"
import { Statistics } from "@/lib/types"

interface StatisticsCardProps {
  title: string;
  value: number;
  change: number;
  period: string;
  description: string;
  formatValue?: (value: number) => string;
}

export default function StatisticsCard({ 
  title, 
  value, 
  change, 
  period, 
  description,
  formatValue = (v) => v.toString()
}: StatisticsCardProps) {
  const isPositive = change > 0;
  const formattedChange = `${isPositive ? '+' : ''}${change}%`;

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        <div
          className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
            isPositive ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
          }`}
        >
          {isPositive ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
          {formattedChange} {period}
        </div>
      </div>
      <p className="mt-2 text-3xl font-bold">{formatValue(value)}</p>
      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </div>
  )
}

