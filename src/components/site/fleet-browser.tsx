"use client";

import * as React from "react";
import { Search, SlidersHorizontal, CarFront } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { VehicleCard, VehicleCardSkeleton } from "@/components/site/vehicle-card";
import { useVehicles } from "@/lib/hooks/use-vehicles";
import type { Vehicle } from "@/lib/default-content";

type SortKey = "recommended" | "price-asc" | "price-desc" | "rating";

export function FleetBrowser() {
  const { vehicles } = useVehicles();
  const [type, setType] = React.useState<"all" | "car" | "bike">("all");
  const [search, setSearch] = React.useState("");
  const [location, setLocation] = React.useState<string>("all");
  const [sort, setSort] = React.useState<SortKey>("recommended");

  const locations = React.useMemo(
    () => Array.from(new Set(vehicles.map((v) => v.location))).sort(),
    [vehicles]
  );

  const filtered = React.useMemo(() => {
    let list = vehicles.filter((v: Vehicle) => {
      if (type !== "all" && v.type !== type) return false;
      if (location !== "all" && v.location !== location) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const haystack = `${v.name} ${v.category} ${v.location}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sort === "price-asc") return a.pricePerDay - b.pricePerDay;
      if (sort === "price-desc") return b.pricePerDay - a.pricePerDay;
      if (sort === "rating") return b.rating - a.rating;
      return Number(b.available) - Number(a.available); // recommended: available first
    });

    return list;
  }, [vehicles, type, location, search, sort]);

  const resetFilters = () => {
    setType("all");
    setSearch("");
    setLocation("all");
    setSort("recommended");
  };

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={type} onValueChange={(v) => setType(v as typeof type)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="car">Cars</TabsTrigger>
            <TabsTrigger value="bike">Bikes</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:justify-end">
          <div className="relative sm:w-56">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or city"
              className="pl-9"
            />
          </div>

          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="sm:w-40">
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All cities</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger className="sm:w-44">
              <SlidersHorizontal className="size-3.5 opacity-60" />
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="price-asc">Price: low to high</SelectItem>
              <SelectItem value="price-desc">Price: high to low</SelectItem>
              <SelectItem value="rating">Top rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? "vehicle" : "vehicles"} available
      </p>

      {filtered.length > 0 ? (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((vehicle, i) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} index={i} />
          ))}
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center rounded-xl border border-dashed border-border py-16 text-center">
          <CarFront className="size-8 text-muted-foreground" strokeWidth={1.25} />
          <p className="mt-3 font-display text-base font-semibold">Nothing matches those filters</p>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            Try a different city or clear your filters to see the full fleet.
          </p>
          <Button variant="outline" size="sm" className="mt-4" onClick={resetFilters}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}

export function FleetBrowserSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <VehicleCardSkeleton key={i} />
      ))}
    </div>
  );
}
