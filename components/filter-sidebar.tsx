"use client";

import { Sliders, X } from "lucide-react";
import { useState } from "react";

export interface FilterState {
  budget: string;
  regions: string[];
  environments: string[];
  season: string;
}

interface FilterSidebarProps {
  onFilterChange: (filters: FilterState) => void;
}

export default function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [budget, setBudget] = useState<string>("");
  const [regions, setRegions] = useState<string[]>(["전체"]);
  const [environments, setEnvironments] = useState<string[]>([]);
  const [season, setSeason] = useState<string>("");

  const handleBudgetChange = (value: string) => {
    setBudget(value);
    onFilterChange({ budget: value, regions, environments, season });
  };

  const handleRegionChange = (region: string) => {
    let newRegions: string[];
    if (region === "전체") {
      newRegions = ["전체"];
    } else {
      const filteredRegions = regions.filter((r) => r !== "전체");
      if (filteredRegions.includes(region)) {
        newRegions = filteredRegions.filter((r) => r !== region);
        if (newRegions.length === 0) {
          newRegions = ["전체"];
        }
      } else {
        newRegions = [...filteredRegions, region];
      }
    }
    setRegions(newRegions);
    onFilterChange({ budget, regions: newRegions, environments, season });
  };

  const handleEnvironmentChange = (env: string) => {
    const newEnvironments = environments.includes(env)
      ? environments.filter((e) => e !== env)
      : [...environments, env];
    setEnvironments(newEnvironments);
    onFilterChange({ budget, regions, environments: newEnvironments, season });
  };

  const handleSeasonChange = (value: string) => {
    setSeason(value);
    onFilterChange({ budget, regions, environments, season: value });
  };

  const handleReset = () => {
    setBudget("");
    setRegions(["전체"]);
    setEnvironments([]);
    setSeason("");
    onFilterChange({ budget: "", regions: ["전체"], environments: [], season: "" });
  };

  return (
    <>
      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transition-all z-40"
      >
        <Sliders className="h-6 w-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-[73px] left-0 h-[calc(100vh-73px)] w-80 bg-slate-900/95 backdrop-blur-md border-r border-purple-500/20 overflow-y-auto z-50 transition-transform shadow-2xl shadow-purple-500/10
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2 text-white">
              <Sliders className="h-5 w-5 text-purple-400" />
              필터
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1 hover:bg-slate-800/50 rounded text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Budget Filter */}
          <div className="mb-6 pb-6 border-b border-purple-500/20">
            <h3 className="font-semibold mb-3 text-purple-300">예산</h3>
            <div className="space-y-2">
              {["150만원 이하", "150~250만원", "250만원 이상"].map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="budget"
                    value={option}
                    checked={budget === option}
                    onChange={(e) => handleBudgetChange(e.target.value)}
                    className="w-4 h-4 text-purple-500 bg-slate-800 border-purple-500/30"
                  />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Region Filter */}
          <div className="mb-6 pb-6 border-b border-purple-500/20">
            <h3 className="font-semibold mb-3 text-purple-300">지역</h3>
            <div className="space-y-2">
              {["전체", "수도권", "경상도", "전라도", "강원도", "제주도", "충청도"].map((region) => (
                <label key={region} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={regions.includes(region)}
                    onChange={() => handleRegionChange(region)}
                    className="w-4 h-4 text-purple-500 bg-slate-800 border-purple-500/30 rounded"
                  />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    {region}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Environment Filter */}
          <div className="mb-6 pb-6 border-b border-purple-500/20">
            <h3 className="font-semibold mb-3 text-purple-300">환경</h3>
            <div className="space-y-2">
              {["자연친화", "도심선호", "카페작업", "코워킹 필수"].map((env) => (
                <label key={env} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={environments.includes(env)}
                    onChange={() => handleEnvironmentChange(env)}
                    className="w-4 h-4 text-purple-500 bg-slate-800 border-purple-500/30 rounded"
                  />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    {env}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Season Filter */}
          <div className="mb-6 pb-6 border-b border-purple-500/20">
            <h3 className="font-semibold mb-3 text-purple-300">최고 계절</h3>
            <div className="space-y-2">
              {["봄", "여름", "가을", "겨울"].map((s) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="season"
                    value={s}
                    checked={season === s}
                    onChange={(e) => handleSeasonChange(e.target.value)}
                    className="w-4 h-4 text-purple-500 bg-slate-800 border-purple-500/30"
                  />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    {s}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleReset}
              className="w-full py-3 border border-purple-500/30 text-gray-300 rounded-lg font-medium hover:bg-slate-800/50 hover:border-purple-500/50 transition-all"
            >
              초기화
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
