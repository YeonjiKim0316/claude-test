"use client";

import { useState, useMemo, useTransition } from "react";
import CityCard from "@/components/city-card";
import FilterSidebar, { FilterState } from "@/components/filter-sidebar";
import { Search, TrendingUp } from "lucide-react";
import { CityListItem } from "@/lib/database.types";
import { getCities } from "@/app/actions/cities";

interface CityListClientProps {
  initialCities: CityListItem[];
  stats: {
    cities: number;
    reviews: number;
    nomads: number;
  };
}

export default function CityListClient({ initialCities, stats }: CityListClientProps) {
  const [cities, setCities] = useState<CityListItem[]>(initialCities);
  const [filters, setFilters] = useState<FilterState>({
    budget: "",
    regions: ["전체"],
    environments: [],
    season: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isPending, startTransition] = useTransition();

  // Client-side filtering for immediate feedback
  const filteredCities = useMemo(() => {
    return cities.filter((city) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !city.name_ko.toLowerCase().includes(query) &&
          !city.name_en.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Budget filter
      if (filters.budget && city.budget !== filters.budget) {
        return false;
      }

      // Region filter
      if (!filters.regions.includes("전체") && !filters.regions.includes(city.korean_region)) {
        return false;
      }

      // Environment filter
      if (filters.environments.length > 0) {
        const hasMatchingEnv = filters.environments.some((env) =>
          city.environment.includes(env)
        );
        if (!hasMatchingEnv) {
          return false;
        }
      }

      // Season filter
      if (filters.season && city.best_season !== filters.season) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      // Sort by likes (from city_stats)
      const aLikes = a.city_stats?.likes || 0;
      const bLikes = b.city_stats?.likes || 0;
      return bLikes - aLikes;
    });
  }, [cities, filters, searchQuery]);

  // Handle filter changes and optionally refetch from server
  const handleFilterChange = async (newFilters: FilterState) => {
    setFilters(newFilters);

    // Optionally refetch from server for server-side filtering
    // startTransition(async () => {
    //   const result = await getCities({
    //     budget: newFilters.budget,
    //     regions: newFilters.regions,
    //     environments: newFilters.environments,
    //     season: newFilters.season,
    //   });
    //   if (result.success) {
    //     setCities(result.data);
    //   }
    // });
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <>
      <FilterSidebar onFilterChange={handleFilterChange} />

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
            <form onSubmit={handleSearch} className="relative max-w-3xl">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-purple-400" />
              <input
                type="text"
                placeholder="도시 이름으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 text-white text-lg placeholder-gray-400 shadow-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </form>

            {/* Filter Selects */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6 max-w-3xl">
              {/* Budget Select */}
              <select
                value={filters.budget}
                onChange={(e) => setFilters({ ...filters, budget: e.target.value })}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="">예산 전체</option>
                <option value="150만원 이하">150만원 이하</option>
                <option value="150~250만원">150~250만원</option>
                <option value="250만원 이상">250만원 이상</option>
              </select>

              {/* Region Select */}
              <select
                value={filters.regions.includes("전체") ? "전체" : filters.regions[0] || "전체"}
                onChange={(e) => setFilters({ ...filters, regions: e.target.value === "전체" ? ["전체"] : [e.target.value] })}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="전체">지역 전체</option>
                <option value="수도권">수도권</option>
                <option value="경상도">경상도</option>
                <option value="전라도">전라도</option>
                <option value="강원도">강원도</option>
                <option value="제주도">제주도</option>
                <option value="충청도">충청도</option>
              </select>

              {/* Environment Select */}
              <select
                value={filters.environments[0] || ""}
                onChange={(e) => setFilters({ ...filters, environments: e.target.value ? [e.target.value] : [] })}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="">환경 전체</option>
                <option value="자연친화">자연친화</option>
                <option value="도심선호">도심선호</option>
                <option value="카페작업">카페작업</option>
                <option value="코워킹 필수">코워킹 필수</option>
              </select>

              {/* Season Select */}
              <select
                value={filters.season}
                onChange={(e) => setFilters({ ...filters, season: e.target.value })}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="">계절 전체</option>
                <option value="봄">봄</option>
                <option value="여름">여름</option>
                <option value="가을">가을</option>
                <option value="겨울">겨울</option>
              </select>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 max-w-3xl">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-colors">
                <div className="text-4xl font-bold text-purple-400">{stats.cities}</div>
                <div className="text-sm text-gray-400 mt-1">도시</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-colors">
                <div className="text-4xl font-bold text-pink-400">
                  {stats.reviews}
                </div>
                <div className="text-sm text-gray-400 mt-1">리뷰</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-colors">
                <div className="text-4xl font-bold text-blue-400">
                  {stats.nomads.toLocaleString()}
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
              <button
                onClick={() => setViewMode('grid')}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-purple-500/50'
                    : 'border border-purple-500/30 text-gray-300 hover:bg-slate-800/50'
                }`}
                aria-pressed={viewMode === 'grid'}
                aria-label="그리드 뷰로 전환"
              >
                그리드
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-purple-500/50'
                    : 'border border-purple-500/30 text-gray-300 hover:bg-slate-800/50'
                }`}
                aria-pressed={viewMode === 'list'}
                aria-label="리스트 뷰로 전환"
              >
                리스트
              </button>
            </div>
          </div>

          {/* Cities Grid/List */}
          {isPending ? (
            <div className="text-center text-gray-400 py-12">
              도시 목록을 불러오는 중...
            </div>
          ) : filteredCities.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              검색 결과가 없습니다. 다른 조건으로 검색해보세요.
            </div>
          ) : (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'
                : 'flex flex-col gap-6 max-w-4xl mx-auto'
            }>
              {filteredCities.map((city) => (
                <CityCard key={city.id} city={city} viewMode={viewMode} />
              ))}
            </div>
          )}
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
    </>
  );
}
