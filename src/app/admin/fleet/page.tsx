"use client";

import Link from "next/link";
import { Plus, Car, Bike } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useVehicles } from "@/lib/hooks/use-vehicles";

export default function FleetManagerPage() {
  const { vehicles } = useVehicles();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Fleet</h1>
          <p className="mt-1 text-sm text-muted-foreground">{vehicles.length} vehicles listed.</p>
        </div>
        <Button asChild>
          <Link href="/admin/fleet/new">
            <Plus className="size-4" /> Add vehicle
          </Link>
        </Button>
      </div>

      <Card className="mt-6">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Price/day</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>
                    <div className="flex items-center gap-2 font-medium">
                      {v.type === "car" ? (
                        <Car className="size-4 text-muted-foreground" />
                      ) : (
                        <Bike className="size-4 text-muted-foreground" />
                      )}
                      {v.name}
                    </div>
                    <p className="text-xs text-muted-foreground">{v.category}</p>
                  </TableCell>
                  <TableCell className="capitalize">{v.type}</TableCell>
                  <TableCell>{v.location}</TableCell>
                  <TableCell className="font-mono-num">₹{v.pricePerDay.toLocaleString("en-IN")}</TableCell>
                  <TableCell>
                    <Badge variant={v.available ? "success" : "outline"}>
                      {v.available ? "Available" : "Hidden"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/fleet/${v.id}`}>Edit</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
