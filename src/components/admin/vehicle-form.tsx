"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploader } from "@/components/admin/image-uploader";
import { createVehicle, updateVehicle, deleteVehicle } from "@/lib/vehicles-admin";
import { vehicleSchema, type VehicleFormValues } from "@/lib/validation/vehicle";
import type { Vehicle } from "@/lib/default-content";

export function VehicleForm({ existing }: { existing?: Vehicle }) {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: existing
      ? {
          type: existing.type,
          name: existing.name,
          category: existing.category,
          pricePerDay: existing.pricePerDay,
          images: existing.images,
          transmission: existing.transmission ?? "Manual",
          fuel: existing.fuel ?? "Petrol",
          seats: existing.seats ?? 5,
          rating: existing.rating,
          location: existing.location,
          available: existing.available,
          description: existing.description ?? "",
          featuresText: (existing.features ?? []).join("\n"),
        }
      : {
          type: "car",
          name: "",
          category: "",
          pricePerDay: 1000,
          images: [],
          transmission: "Manual",
          fuel: "Petrol",
          seats: 5,
          rating: 4.5,
          location: "",
          available: true,
          description: "",
          featuresText: "",
        },
  });

  const type = watch("type");

  const onSubmit = async (values: VehicleFormValues) => {
    setSaving(true);
    try {
      const payload = {
        type: values.type,
        name: values.name,
        category: values.category,
        pricePerDay: values.pricePerDay,
        images: values.images,
        transmission: values.transmission,
        fuel: values.fuel,
        seats: values.seats,
        rating: values.rating,
        location: values.location,
        available: values.available,
        description: values.description,
        features: (values.featuresText ?? "")
          .split("\n")
          .map((f) => f.trim())
          .filter(Boolean),
      };

      if (existing) {
        await updateVehicle(existing.id, payload);
        toast.success("Vehicle updated.");
      } else {
        await createVehicle(payload);
        toast.success("Vehicle added to the fleet.");
      }
      router.push("/admin/fleet");
    } catch {
      toast.error("Couldn't save — please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!existing) return;
    if (!confirm(`Delete ${existing.name}? This can't be undone.`)) return;
    setDeleting(true);
    try {
      await deleteVehicle(existing.id);
      toast.success("Vehicle deleted.");
      router.push("/admin/fleet");
    } catch {
      toast.error("Couldn't delete — please try again.");
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">
            {existing ? `Edit ${existing.name}` : "Add a vehicle"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {existing ? "Changes go live immediately." : "New listings appear on the site as soon as you save."}
          </p>
        </div>
        <div className="flex gap-2">
          {existing && (
            <Button type="button" variant="outline" onClick={handleDelete} disabled={deleting}>
              {deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
              Delete
            </Button>
          )}
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {existing ? "Save changes" : "Add vehicle"}
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardContent className="space-y-5 p-5">
            <div>
              <Label className="text-xs text-muted-foreground">Type</Label>
              <Tabs value={type} onValueChange={(v) => setValue("type", v as "car" | "bike")} className="mt-1.5">
                <TabsList>
                  <TabsTrigger value="car">Car</TabsTrigger>
                  <TabsTrigger value="bike">Bike</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Name</Label>
                <Input className="mt-1.5" placeholder="Vantage Sedan" {...register("name")} />
                {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div>
                <Label>Category</Label>
                <Input className="mt-1.5" placeholder="Sedan" {...register("category")} />
                {errors.category && <p className="mt-1 text-xs text-destructive">{errors.category.message}</p>}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label>Price / day (₹)</Label>
                <Input type="number" className="mt-1.5" {...register("pricePerDay", { valueAsNumber: true })} />
                {errors.pricePerDay && (
                  <p className="mt-1 text-xs text-destructive">{errors.pricePerDay.message}</p>
                )}
              </div>
              <div>
                <Label>Seats</Label>
                <Input type="number" className="mt-1.5" {...register("seats", { valueAsNumber: true })} />
              </div>
              <div>
                <Label>Rating</Label>
                <Input type="number" step="0.1" className="mt-1.5" {...register("rating", { valueAsNumber: true })} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label className="text-xs text-muted-foreground">Transmission</Label>
                <Controller
                  control={control}
                  name="transmission"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manual">Manual</SelectItem>
                        <SelectItem value="Automatic">Automatic</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Fuel</Label>
                <Controller
                  control={control}
                  name="fuel"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Petrol">Petrol</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Electric">Electric</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Label>City</Label>
                <Input className="mt-1.5" placeholder="Bengaluru" {...register("location")} />
                {errors.location && <p className="mt-1 text-xs text-destructive">{errors.location.message}</p>}
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea className="mt-1.5" rows={3} {...register("description")} />
            </div>

            <div>
              <Label>Features (one per line)</Label>
              <Textarea
                className="mt-1.5"
                rows={4}
                placeholder={"Air conditioning\nBluetooth audio\nReverse camera"}
                {...register("featuresText")}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium">Available for booking</p>
                <p className="text-xs text-muted-foreground">Turn off to hide it from checkout without deleting it.</p>
              </div>
              <Controller
                control={control}
                name="available"
                render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:sticky lg:top-20 lg:self-start">
          <CardContent className="p-5">
            <p className="text-sm font-medium">Photos</p>
            <p className="mt-1 text-xs text-muted-foreground">
              First photo is the cover shown on listing cards. Uploads go straight to Cloudinary.
            </p>
            <div className="mt-3">
              <Controller
                control={control}
                name="images"
                render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
