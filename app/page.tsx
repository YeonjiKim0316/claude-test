import { getCities, getTotalStats } from "@/app/actions/cities";
import CityListClient from "@/components/city-list-client";
import { Search } from "lucide-react";

export const revalidate = 300; // Revalidate every 5 minutes

export default async function Home() {
  // Fetch initial data on the server
  const [citiesResult, statsResult] = await Promise.all([
    getCities(),
    getTotalStats(),
  ]);

  const cities = citiesResult.success ? citiesResult.data : [];
  const stats = statsResult.success ? statsResult.data : { cities: 0, reviews: 0, nomads: 0 };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <CityListClient initialCities={cities} stats={stats} />
    </div>
  );
}
