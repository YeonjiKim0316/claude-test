"use client";

import { useState } from "react";
import { createCity, type CreateCityInput } from "@/app/actions/admin";
import { Plus } from "lucide-react";

interface AddCityFormProps {
  onSuccess?: () => Promise<void>;
}

export default function AddCityForm({ onSuccess }: AddCityFormProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateCityInput>({
    name_ko: "",
    name_en: "",
    slug: "",
    country: "",
    region: "",
    korean_region: "",
    budget: "중",
    environment: [],
    best_season: "",
    image_url: "",
    cost_per_month: 0,
    description: "",
    climate: "",
    timezone: "",
    currency: "",
    language: "",
    visa_info: "",
    safety_rating: 0,
    internet_speed: 0,
    accommodation: 0,
    food: 0,
    transportation: 0,
    entertainment: 0,
    utilities: 0,
    coworking: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await createCity(formData);

      if (result.success) {
        alert("도시가 성공적으로 추가되었습니다!");
        // Call onSuccess callback if provided
        if (onSuccess) {
          await onSuccess();
        }
        // Reset form
        setFormData({
          name_ko: "",
          name_en: "",
          slug: "",
          country: "",
          region: "",
          korean_region: "",
          budget: "중",
          environment: [],
          best_season: "",
          image_url: "",
          cost_per_month: 0,
          description: "",
          climate: "",
          timezone: "",
          currency: "",
          language: "",
          visa_info: "",
          safety_rating: 0,
          internet_speed: 0,
          accommodation: 0,
          food: 0,
          transportation: 0,
          entertainment: 0,
          utilities: 0,
          coworking: 0,
        });
      } else {
        alert(`오류: ${result.error}`);
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("도시 추가 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnvironmentChange = (env: string) => {
    setFormData((prev) => {
      const environments = prev.environment.includes(env)
        ? prev.environment.filter((e) => e !== env)
        : [...prev.environment, env];
      return { ...prev, environment: environments };
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Basic Info */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          도시명 (한글) *
        </label>
        <input
          type="text"
          required
          value={formData.name_ko}
          onChange={(e) => setFormData({ ...formData, name_ko: e.target.value })}
          className="w-full px-3 py-2 bg-slate-700/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
          placeholder="예: 방콕"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          도시명 (영문) *
        </label>
        <input
          type="text"
          required
          value={formData.name_en}
          onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
          className="w-full px-3 py-2 bg-slate-700/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
          placeholder="예: Bangkok"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          슬러그 (URL) *
        </label>
        <input
          type="text"
          required
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          className="w-full px-3 py-2 bg-slate-700/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
          placeholder="예: bangkok"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          국가 *
        </label>
        <input
          type="text"
          required
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          className="w-full px-3 py-2 bg-slate-700/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
          placeholder="예: Thailand"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            지역 (영문) *
          </label>
          <input
            type="text"
            required
            value={formData.region}
            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            className="w-full px-3 py-2 bg-slate-700/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
            placeholder="예: Southeast Asia"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            지역 (한글) *
          </label>
          <input
            type="text"
            required
            value={formData.korean_region}
            onChange={(e) => setFormData({ ...formData, korean_region: e.target.value })}
            className="w-full px-3 py-2 bg-slate-700/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
            placeholder="예: 동남아시아"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          예산 *
        </label>
        <select
          required
          value={formData.budget}
          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
          className="w-full px-3 py-2 bg-slate-700/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
        >
          <option value="저">저</option>
          <option value="중">중</option>
          <option value="고">고</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          환경 *
        </label>
        <div className="grid grid-cols-2 gap-2">
          {["해변", "도시", "산", "사막", "열대", "온대"].map((env) => (
            <label key={env} className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={formData.environment.includes(env)}
                onChange={() => handleEnvironmentChange(env)}
                className="rounded border-purple-500/20"
              />
              {env}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          최고 계절 *
        </label>
        <input
          type="text"
          required
          value={formData.best_season}
          onChange={(e) => setFormData({ ...formData, best_season: e.target.value })}
          className="w-full px-3 py-2 bg-slate-700/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
          placeholder="예: 11월-2월"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          이미지 URL
        </label>
        <input
          type="url"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          className="w-full px-3 py-2 bg-slate-700/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          월 평균 비용 (원) *
        </label>
        <input
          type="number"
          required
          value={formData.cost_per_month}
          onChange={(e) => setFormData({ ...formData, cost_per_month: Number(e.target.value) })}
          className="w-full px-3 py-2 bg-slate-700/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
          placeholder="예: 1500000"
        />
      </div>

      {/* Cost Breakdown */}
      <div className="border-t border-purple-500/20 pt-4">
        <h3 className="text-sm font-semibold text-purple-400 mb-3">비용 상세</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">숙박비</label>
            <input
              type="number"
              value={formData.accommodation}
              onChange={(e) => setFormData({ ...formData, accommodation: Number(e.target.value) })}
              className="w-full px-2 py-1.5 bg-slate-700/50 border border-purple-500/20 rounded text-white text-sm focus:outline-none focus:border-purple-500/50"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">식비</label>
            <input
              type="number"
              value={formData.food}
              onChange={(e) => setFormData({ ...formData, food: Number(e.target.value) })}
              className="w-full px-2 py-1.5 bg-slate-700/50 border border-purple-500/20 rounded text-white text-sm focus:outline-none focus:border-purple-500/50"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">교통비</label>
            <input
              type="number"
              value={formData.transportation}
              onChange={(e) => setFormData({ ...formData, transportation: Number(e.target.value) })}
              className="w-full px-2 py-1.5 bg-slate-700/50 border border-purple-500/20 rounded text-white text-sm focus:outline-none focus:border-purple-500/50"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">오락비</label>
            <input
              type="number"
              value={formData.entertainment}
              onChange={(e) => setFormData({ ...formData, entertainment: Number(e.target.value) })}
              className="w-full px-2 py-1.5 bg-slate-700/50 border border-purple-500/20 rounded text-white text-sm focus:outline-none focus:border-purple-500/50"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">공과금</label>
            <input
              type="number"
              value={formData.utilities}
              onChange={(e) => setFormData({ ...formData, utilities: Number(e.target.value) })}
              className="w-full px-2 py-1.5 bg-slate-700/50 border border-purple-500/20 rounded text-white text-sm focus:outline-none focus:border-purple-500/50"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">코워킹</label>
            <input
              type="number"
              value={formData.coworking}
              onChange={(e) => setFormData({ ...formData, coworking: Number(e.target.value) })}
              className="w-full px-2 py-1.5 bg-slate-700/50 border border-purple-500/20 rounded text-white text-sm focus:outline-none focus:border-purple-500/50"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="h-5 w-5" />
        {isLoading ? "추가 중..." : "도시 추가"}
      </button>
    </form>
  );
}
