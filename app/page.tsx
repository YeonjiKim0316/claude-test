"use client";

import { useState, useMemo } from "react";
import CityCard from "@/components/city-card";
import FilterSidebar, { FilterState } from "@/components/filter-sidebar";
import { mockCities } from "@/lib/mock-data";
import { City } from "@/lib/types";
import { Search, TrendingUp } from "lucide-react";

export default function Home() {
  const [filters, setFilters] = useState<FilterState>({
    budget: "",
    regions: ["전체"],
    environments: [],
    season: "",
  });

  const filteredCities = useMemo(() => {
    return mockCities
      .filter((city: City) => {
        // Budget filter
        if (filters.budget && city.budget !== filters.budget) {
          return false;
        }

        // Region filter
        if (!filters.regions.includes("전체") && !filters.regions.includes(city.koreanRegion)) {
          return false;
        }

        // Environment filter
        if (filters.environments.length > 0) {
          const hasMatchingEnv = filters.environments.some((env) =>
            city.environment.includes(env as "자연친화" | "도심선호" | "카페작업" | "코워킹 필수")
          );
          if (!hasMatchingEnv) {
            return false;
          }
        }

        // Season filter
        if (filters.season && city.bestSeason !== filters.season) {
          return false;
        }

        return true;
      })
      .sort((a, b) => b.likes - a.likes);
  }, [filters]);

  return (
    <div className="flex min-h-screen bg-gray-900">
      <FilterSidebar onFilterChange={setFilters} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-16 px-4 border-b border-purple-500/20">
          <div className="container mx-auto max-w-6xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              당신에게 완벽한 도시를 찾아보세요
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10">
              전 세계 디지털 노마드들이 사랑하는 도시를 탐색하고 비교해보세요
            </p>

            {/* Search Bar */}
            <div className="relative max-w-3xl">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-purple-400" />
              <input
                type="text"
                placeholder="도시 이름으로 검색..."
                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 text-white text-lg placeholder-gray-400 shadow-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 max-w-3xl">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-colors">
                <div className="text-4xl font-bold text-purple-400">{mockCities.length}</div>
                <div className="text-sm text-gray-400 mt-1">도시</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-colors">
                <div className="text-4xl font-bold text-pink-400">
                  {mockCities.reduce((sum, city) => sum + city.reviews_count, 0)}
                </div>
                <div className="text-sm text-gray-400 mt-1">리뷰</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-colors">
                <div className="text-4xl font-bold text-blue-400">
                  {mockCities.reduce((sum, city) => sum + city.nomads_now, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-400 mt-1">노마드</div>
              </div>
            </div>
          </div>
        </section>

        {/* Cities Grid */}
        <section className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                도시 리스트
              </h2>
              <p className="text-gray-400 mt-2 text-lg">
                {filteredCities.length}개의 도시를 찾았습니다
              </p>
            </div>

            {/* View Options */}
            <div className="hidden md:flex items-center gap-3 text-sm">
              <button className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-purple-500/50 transition-all">
                그리드
              </button>
              <button className="px-5 py-2.5 border border-purple-500/30 text-gray-300 rounded-xl font-medium hover:bg-slate-800/50 transition-all">
                리스트
              </button>
            </div>
          </div>

          {/* Cities Grid - 3 cards per row on large screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredCities.map((city) => (
              <CityCard key={city.id} city={city} />
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-t border-purple-500/20 py-20 px-4 mt-16">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              최신 소식을 받아보세요
            </h2>
            <p className="text-gray-300 text-lg mb-10">
              새로운 도시 정보와 디지털 노마드 팁을 이메일로 받아보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="이메일 주소"
                className="flex-1 px-6 py-4 bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 text-white rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300">
                구독하기
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
