"use client";

import { useState, useEffect } from "react";
import { getAllCitiesForAdmin, deleteCity } from "@/app/actions/admin";
import { CityWithDetails } from "@/lib/database.types";
import { Trash2, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function CityManagementList() {
  const [cities, setCities] = useState<CityWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load cities on mount
  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAllCitiesForAdmin();

      if (result.success && result.data) {
        setCities(result.data);
      } else {
        setError(result.error || "도시 목록을 불러오는데 실패했습니다");
      }
    } catch {
      setError("도시 목록을 불러오는 중 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cityId: string, cityName: string) => {
    if (!confirm(`"${cityName}"을(를) 정말 삭제하시겠습니까?`)) {
      return;
    }

    try {
      setDeletingId(cityId);
      const result = await deleteCity(cityId);

      if (result.success) {
        // Refresh the list
        await loadCities();
      } else {
        alert(result.error || "도시 삭제에 실패했습니다");
      }
    } catch {
      alert("도시 삭제 중 오류가 발생했습니다");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-gray-400">도시 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400">{error}</p>
          <button
            onClick={loadCities}
            className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (cities.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">등록된 도시가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-purple-500/20">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">
                이미지
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">
                도시명
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">
                국가/지역
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">
                예산
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">
                생성일
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">
                액션
              </th>
            </tr>
          </thead>
          <tbody>
            {cities.map((city) => (
              <tr
                key={city.id}
                className="border-b border-purple-500/10 hover:bg-slate-700/30 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                    {city.image_url ? (
                      <Image
                        src={city.image_url}
                        alt={city.name_ko}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                        <span className="text-gray-500 text-xs">No Image</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <div className="font-semibold text-white">{city.name_ko}</div>
                    <div className="text-sm text-gray-400">{city.name_en}</div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <div className="text-white">{city.region}</div>
                    <div className="text-sm text-gray-400">{city.korean_region}</div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300">
                    {city.budget}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-300 text-sm">
                  {formatDate(city.created_at)}
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleDelete(city.id, city.name_ko)}
                    disabled={deletingId === city.id}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="h-4 w-4" />
                    {deletingId === city.id ? "삭제 중..." : "삭제"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {cities.map((city) => (
          <div
            key={city.id}
            className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/10"
          >
            <div className="flex gap-4">
              {/* Image */}
              <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                {city.image_url ? (
                  <Image
                    src={city.image_url}
                    alt={city.name_ko}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                    <span className="text-gray-500 text-xs">No Image</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white truncate">
                  {city.name_ko}
                </div>
                <div className="text-sm text-gray-400 truncate">
                  {city.name_en}
                </div>
                <div className="mt-1 flex flex-wrap gap-2 text-sm">
                  <span className="text-gray-300">{city.region}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400">{city.korean_region}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300">
                    {city.budget}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(city.created_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-purple-500/10">
              <button
                onClick={() => handleDelete(city.id, city.name_ko)}
                disabled={deletingId === city.id}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="h-4 w-4" />
                {deletingId === city.id ? "삭제 중..." : "삭제"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
