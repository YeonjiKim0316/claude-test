import Link from "next/link";
import { Globe, Menu, LogOut, User } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { signOut } from "./header-actions";

export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="border-b border-purple-500/20 bg-slate-900/95 backdrop-blur-md sticky top-0 z-50 shadow-lg shadow-purple-500/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Globe className="h-7 w-7 text-purple-400 group-hover:text-pink-400 transition-colors" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Nomad Cities
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-purple-500/20">
                  <User className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-gray-300">{user.email}</span>
                </div>
                <form action={signOut}>
                  <button className="hidden md:block px-5 py-2 text-sm font-medium border border-purple-500/30 text-gray-300 rounded-lg hover:bg-slate-800/50 hover:border-purple-500/50 transition-all flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    로그아웃
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="hidden md:block px-5 py-2 text-sm font-medium border border-purple-500/30 text-gray-300 rounded-lg hover:bg-slate-800/50 hover:border-purple-500/50 transition-all">
                  로그인
                </Link>
                <Link href="/auth/signup" className="hidden md:block px-5 py-2 text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                  시작하기
                </Link>
              </>
            )}
            <button className="md:hidden text-gray-300 hover:text-purple-400 transition-colors">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
