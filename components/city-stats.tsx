import { Star, DollarSign, Wifi, Shield, Users } from "lucide-react";
import { CityWithDetails } from "@/lib/database.types";

interface CityStatsProps {
  city: CityWithDetails;
}

export default function CityStats({ city }: CityStatsProps) {
  const stats = [
    {
      icon: Star,
      label: "종합 평점",
      value: city.overall_score.toFixed(1),
      suffix: "/5.0",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
    {
      icon: DollarSign,
      label: "월 생활비",
      value: `${(city.cost_per_month / 10000).toFixed(0)}만원`,
      suffix: "",
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Wifi,
      label: "인터넷 속도",
      value: city.internet_speed,
      suffix: "Mbps",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Shield,
      label: "안전 지수",
      value: city.safety_score.toFixed(1),
      suffix: "/5.0",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: Users,
      label: "현재 노마드",
      value: city.city_stats?.nomads_now || 0,
      suffix: "명",
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/20"
          >
            <div className={`${stat.bgColor} ${stat.color} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
              <Icon className="h-6 w-6" />
            </div>
            <div className="text-sm text-gray-400 mb-2">{stat.label}</div>
            <div className="text-2xl font-bold text-white">
              {stat.value}
              {stat.suffix && (
                <span className="text-sm text-gray-400 ml-1">{stat.suffix}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
