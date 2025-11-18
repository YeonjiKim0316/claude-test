import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* 404 Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="text-9xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              404
            </div>
            <Search className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-20 w-20 text-purple-400 opacity-20" />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            도시를 찾을 수 없습니다
          </h1>
          <p className="text-lg text-gray-300">
            요청하신 도시 페이지가 존재하지 않거나 이동되었습니다.
          </p>
          <p className="text-sm text-gray-400">
            URL을 다시 확인하시거나 메인 페이지에서 도시를 선택해주세요.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Home className="h-5 w-5" />
            메인으로 돌아가기
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="pt-12 opacity-50">
          <div className="flex justify-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
