import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCityBySlug } from "@/app/actions/cities";
import CityHero from "@/components/city-hero";
import CityStats from "@/components/city-stats";
import CityDescription from "@/components/city-description";
import CityCostBreakdown from "@/components/city-cost-breakdown";
import CityGallery from "@/components/city-gallery";

export const revalidate = 300; // Revalidate every 5 minutes

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CityDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch city from Supabase by slug
  const result = await getCityBySlug(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const city = result.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <CityHero city={city} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Stats Section */}
        <CityStats city={city} />

        {/* Description Section */}
        <CityDescription city={city} />

        {/* Cost Breakdown Section */}
        <CityCostBreakdown city={city} />

        {/* Gallery Section */}
        <CityGallery city={city} />

        {/* Back Button */}
        <div className="flex justify-center pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="h-5 w-5" />
            메인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
