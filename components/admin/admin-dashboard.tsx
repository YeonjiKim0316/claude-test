"use client";

import { useState, useEffect } from "react";
import { getAllCitiesForAdmin } from "@/app/actions/admin";
import CityManagementList, { type CityWithDetails } from "./city-management-list";
import AddCityForm from "./add-city-form";

type TabType = "all" | "korea" | "foreign";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [cities, setCities] = useState<CityWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load cities on mount and when tab changes
  const loadCities = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getAllCitiesForAdmin();

      if (result.success && result.data) {
        setCities(result.data as CityWithDetails[]);
      } else {
        setError(result.error || "도시 목록을 불러오는데 실패했습니다.");
      }
    } catch (err) {
      console.error("Load cities error:", err);
      setError("도시 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCities();
  }, []);

  // Filter cities based on active tab
  const filteredCities = cities.filter((city) => {
    if (activeTab === "all") {
      return true;
    }

    const isKoreanCity =
      city.country === "South Korea" ||
      city.country === "대한민국" ||
      city.korean_region !== undefined;

    if (activeTab === "korea") {
      return isKoreanCity;
    } else {
      // foreign tab
      return !isKoreanCity;
    }
  });

  // Tab button component
  const TabButton = ({ tab, label }: { tab: TabType; label: string }) => {
    const isActive = activeTab === tab;
    return (
      <button
        onClick={() => setActiveTab(tab)}
        className={`
          px-6 py-2.5 rounded-lg font-medium transition-all
          ${
            isActive
              ? "bg-purple-500/20 border border-purple-500/40 text-purple-400"
              : "bg-slate-700/30 border border-gray-600/20 text-gray-400 hover:bg-slate-700/50"
          }
        `}
      >
        {label}
      </button>
    );
  };

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left column: Add City Form */}
      <div className="lg:col-span-1">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">새 도시 추가</h2>
          <AddCityForm onSuccess={loadCities} />
        </div>
      </div>

      {/* Right column: City Management List with Tabs */}
      <div className="lg:col-span-2">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">도시 목록 관리</h2>

          {/* Tab Navigation */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <TabButton tab="all" label="전체" />
            <TabButton tab="korea" label="대한민국" />
            <TabButton tab="foreign" label="해외" />
          </div>

          {/* City Count */}
          <div className="mb-3 text-sm text-gray-400">
            {isLoading ? (
              "로딩 중..."
            ) : (
              <>
                총 {filteredCities.length}개의 도시
                {activeTab !== "all" && (
                  <span className="ml-2 text-gray-500">
                    (전체: {cities.length})
                  </span>
                )}
              </>
            )}
          </div>

          {/* City List */}
          <CityManagementList
            cities={filteredCities}
            isLoading={isLoading}
            onCitiesChange={loadCities}
          />
        </div>
      </div>
    </div>
  );
}
