"use client";

import { useState } from "react";
import { deleteCity } from "@/app/actions/admin";
import { Trash2, Edit2 } from "lucide-react";

// Type for city with all related data
export type CityWithDetails = {
  id: string;
  name_ko: string;
  name_en: string;
  slug: string;
  country: string;
  region: string;
  korean_region?: string;
  budget: string;
  environment: string[];
  best_season: string;
  image_url?: string;
  cost_per_month: number;
  created_at?: string;
  city_details?: any[];
  cost_breakdown?: any[];
  city_stats?: any[];
};

interface CityManagementListProps {
  cities: CityWithDetails[];
  isLoading?: boolean;
  onCitiesChange?: () => Promise<void>;
}

export default function CityManagementList({
  cities,
  isLoading = false,
  onCitiesChange,
}: CityManagementListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (cityId: string, cityName: string) => {
    if (!confirm(`"${cityName}" 도시를 삭제하시겠습니까?`)) {
      return;
    }

    setDeletingId(cityId);
    try {
      const result = await deleteCity(cityId);

      if (result.success) {
        alert("도시가 삭제되었습니다.");
        // Trigger refresh of cities list
        if (onCitiesChange) {
          await onCitiesChange();
        }
      } else {
        alert(`삭제 실패: ${result.error}`);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("도시 삭제 중 오류가 발생했습니다.");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">로딩 중...</div>
      </div>
    );
  }

  if (cities.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">등록된 도시가 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
      {cities.map((city) => (
        <div
          key={city.id}
          className="bg-slate-700/30 border border-purple-500/20 rounded-lg p-4 hover:bg-slate-700/50 transition-all"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-white">
                  {city.name_ko}
                </h3>
                <span className="text-sm text-gray-400">({city.name_en})</span>
              </div>
              <div className="flex flex-wrap gap-2 text-sm text-gray-300">
                <span className="px-2 py-0.5 bg-slate-600/50 rounded">
                  {city.country}
                </span>
                <span className="px-2 py-0.5 bg-purple-500/20 rounded">
                  {city.korean_region || city.region}
                </span>
                <span className="px-2 py-0.5 bg-blue-500/20 rounded">
                  예산: {city.budget}
                </span>
                <span className="px-2 py-0.5 bg-green-500/20 rounded">
                  {city.cost_per_month.toLocaleString()}원/월
                </span>
              </div>
              {city.environment && city.environment.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {city.environment.map((env, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-0.5 bg-slate-600/30 text-gray-400 rounded"
                    >
                      {env}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  // TODO: Implement edit functionality
                  alert("수정 기능은 추후 구현 예정입니다.");
                }}
                className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                title="수정"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(city.id, city.name_ko)}
                disabled={deletingId === city.id}
                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="삭제"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
