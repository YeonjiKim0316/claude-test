import { Wallet, Home, UtensilsCrossed, Bus, Zap } from "lucide-react";
import { CityDetails } from "@/lib/types";

interface CityCostBreakdownProps {
  city: CityDetails;
}

export default function CityCostBreakdown({ city }: CityCostBreakdownProps) {
  const costItems = [
    {
      icon: Home,
      label: "숙박비",
      amount: city.cost_breakdown.accommodation,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: UtensilsCrossed,
      label: "식비",
      amount: city.cost_breakdown.food,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
    },
    {
      icon: Bus,
      label: "교통비",
      amount: city.cost_breakdown.transportation,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Zap,
      label: "공과금",
      amount: city.cost_breakdown.utilities,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
  ];

  const total = city.cost_per_month;
  const maxAmount = Math.max(...costItems.map((item) => item.amount));

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-purple-500/10 p-3 rounded-lg">
          <Wallet className="h-6 w-6 text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">월 생활비 상세</h2>
      </div>

      {/* Cost Items */}
      <div className="space-y-6 mb-8">
        {costItems.map((item, index) => {
          const Icon = item.icon;
          const percentage = (item.amount / maxAmount) * 100;

          return (
            <div key={index} className="space-y-2">
              {/* Label and Amount */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`${item.bgColor} ${item.color} p-2 rounded-lg`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-white font-medium">{item.label}</span>
                </div>
                <span className="text-xl font-bold text-white">
                  {(item.amount / 10000).toFixed(0)}만원
                </span>
              </div>

              {/* Progress Bar */}
              <div className="relative w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${
                    item.color === "text-blue-400"
                      ? "from-blue-500 to-blue-400"
                      : item.color === "text-orange-400"
                      ? "from-orange-500 to-orange-400"
                      : item.color === "text-green-400"
                      ? "from-green-500 to-green-400"
                      : "from-yellow-500 to-yellow-400"
                  } transition-all duration-500 rounded-full`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="border-t border-purple-500/20 pt-6">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-300">총 합계</span>
          <div className="text-right">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              {(total / 10000).toFixed(0)}만원
            </div>
            <div className="text-sm text-gray-400">월 평균 생활비</div>
          </div>
        </div>
      </div>

      {/* Budget Category */}
      <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">예산 카테고리</span>
          <span className="text-sm font-semibold text-purple-400">
            {city.budget}
          </span>
        </div>
      </div>
    </div>
  );
}
