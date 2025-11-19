"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import { CityListItem } from "@/lib/database.types";
import { cn } from "@/lib/utils";
import { toggleLike } from "@/app/actions/interactions";

interface CityCardProps {
  city: CityListItem;
  viewMode?: 'grid' | 'list';
}

export default function CityCard({ city, viewMode = 'grid' }: CityCardProps) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(city.city_stats?.likes || 0);
  const [dislikeCount, setDislikeCount] = useState(city.city_stats?.dislikes || 0);
  const [isLoading, setIsLoading] = useState(false);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Link 클릭 방지
    e.stopPropagation();

    if (isLoading) return;

    try {
      setIsLoading(true);

      // Optimistic update
      const newLiked = !liked;
      setLiked(newLiked);
      setLikeCount(newLiked ? likeCount + 1 : likeCount - 1);

      // 싫어요가 활성화되어 있었다면 해제
      if (disliked && newLiked) {
        setDisliked(false);
        setDislikeCount(dislikeCount - 1);
      }

      // API 호출
      const result = await toggleLike(city.id, true);

      if (!result.success) {
        // 실패 시 롤백
        setLiked(liked);
        setLikeCount(likeCount);
        if (disliked && newLiked) {
          setDisliked(true);
          setDislikeCount(dislikeCount);
        }
        alert(result.error || '좋아요 처리에 실패했습니다. 로그인이 필요합니다.');
      }
    } catch (error) {
      console.error('Like error:', error);
      // 에러 시 롤백
      setLiked(liked);
      setLikeCount(likeCount);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDislikeClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Link 클릭 방지
    e.stopPropagation();

    if (isLoading) return;

    try {
      setIsLoading(true);

      // Optimistic update
      const newDisliked = !disliked;
      setDisliked(newDisliked);
      setDislikeCount(newDisliked ? dislikeCount + 1 : dislikeCount - 1);

      // 좋아요가 활성화되어 있었다면 해제
      if (liked && newDisliked) {
        setLiked(false);
        setLikeCount(likeCount - 1);
      }

      // API 호출
      const result = await toggleLike(city.id, false);

      if (!result.success) {
        // 실패 시 롤백
        setDisliked(disliked);
        setDislikeCount(dislikeCount);
        if (liked && newDisliked) {
          setLiked(true);
          setLikeCount(likeCount);
        }
        alert(result.error || '싫어요 처리에 실패했습니다. 로그인이 필요합니다.');
      }
    } catch (error) {
      console.error('Dislike error:', error);
      // 에러 시 롤백
      setDisliked(disliked);
      setDislikeCount(dislikeCount);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link href={`/cities/${city.slug}`}>
      <div className={cn(
        "group border border-purple-500/20 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 hover:border-purple-500/40 transition-all duration-300 bg-slate-800/50 backdrop-blur-sm",
        viewMode === 'list' && "flex flex-col md:flex-row"
      )}>
        {/* Image Section */}
        <div className={cn(
          "relative overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900",
          viewMode === 'grid' ? "h-56 w-full" : "h-48 md:h-auto md:w-80 flex-shrink-0"
        )}>
          <Image
            src={city.image_url || "/placeholder-city.jpg"}
            alt={city.name_ko}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {city.badge && (
            <div
              className={cn(
                "absolute top-4 right-4 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg",
                city.badge === "Popular" && "bg-gradient-to-r from-orange-500 to-pink-500 text-white",
                city.badge === "Trending" && "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
              )}
            >
              {city.badge === "Popular" ? "🔥 인기" : "📈 트렌딩"}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Content Section */}
        <div className={cn(
          "p-5",
          viewMode === 'list' && "flex-1"
        )}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                {city.name_ko}
              </h3>
              <div className="flex items-center gap-1.5 text-sm text-gray-400 mt-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{city.region}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">월 평균</div>
              <div className="text-lg font-bold text-purple-400">
                {(city.cost_per_month / 10000).toFixed(0)}만원
              </div>
            </div>
          </div>

          {/* City Info - Key-Value Format */}
          <div className="space-y-2.5 mb-4 pb-4 border-b border-purple-500/20">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-gray-300">예산:</span>
              <span className="text-gray-400">{city.budget}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-gray-300">지역:</span>
              <span className="text-gray-400">{city.korean_region}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-gray-300">환경:</span>
              <span className="text-gray-400">{city.environment.join(', ')}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-gray-300">최고 계절:</span>
              <span className="text-gray-400">{city.best_season}</span>
            </div>
          </div>

          {/* Footer with Like/Dislike buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-purple-500/20">
            <div className="flex items-center gap-1.5 text-sm text-gray-400">
              <MessageSquare className="h-4 w-4" />
              <span>{city.city_stats?.reviews_count || 0} 리뷰</span>
            </div>

            {/* Like/Dislike Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleLikeClick}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all",
                  liked
                    ? "bg-purple-500/20 border border-purple-500/40"
                    : "bg-slate-700/30 border border-gray-600/20 hover:bg-slate-700/50"
                )}
              >
                <ThumbsUp className={cn(
                  "h-4 w-4",
                  liked ? "text-purple-500" : "text-gray-400"
                )} />
                <span className={cn(
                  "text-sm font-medium",
                  liked ? "text-purple-400" : "text-gray-400"
                )}>
                  {likeCount}
                </span>
              </button>

              <button
                onClick={handleDislikeClick}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all",
                  disliked
                    ? "bg-red-500/20 border border-red-500/40"
                    : "bg-slate-700/30 border border-gray-600/20 hover:bg-slate-700/50"
                )}
              >
                <span className={cn(
                  "text-sm font-medium",
                  disliked ? "text-red-400" : "text-gray-400"
                )}>
                  {dislikeCount}
                </span>
                <ThumbsDown className={cn(
                  "h-4 w-4",
                  disliked ? "text-red-500" : "text-gray-400"
                )} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
