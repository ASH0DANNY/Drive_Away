"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Trash2, Loader2, BadgePercent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useCoupons } from "@/lib/hooks/use-coupons";
import { createCoupon, updateCoupon, deleteCoupon, type Coupon } from "@/lib/coupons";
import { couponSchema, type CouponFormValues } from "@/lib/validation/coupon";

const emptyDefaults: CouponFormValues = {
  code: "",
  description: "",
  type: "percentage",
  value: 10,
  active: true,
  newCustomerOnly: false,
  minOrderAmount: 0,
  hasMaxUses: false,
  maxUses: 100,
  hasExpiry: false,
  expiresAt: "",
};

function CouponFormDialog({
  open,
  onOpenChange,
  existing,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  existing?: Coupon;
}) {
  const [saving, setSaving] = React.useState(false);
  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: existing
      ? {
          code: existing.code,
          description: existing.description,
          type: existing.type,
          value: existing.value,
          active: existing.active,
          newCustomerOnly: existing.newCustomerOnly,
          minOrderAmount: existing.minOrderAmount,
          hasMaxUses: existing.maxUses !== null,
          maxUses: existing.maxUses ?? 100,
          hasExpiry: !!existing.expiresAt,
          expiresAt: existing.expiresAt ?? "",
        }
      : emptyDefaults,
  });

  React.useEffect(() => {
    reset(
      existing
        ? {
            code: existing.code,
            description: existing.description,
            type: existing.type,
            value: existing.value,
            active: existing.active,
            newCustomerOnly: existing.newCustomerOnly,
            minOrderAmount: existing.minOrderAmount,
            hasMaxUses: existing.maxUses !== null,
            maxUses: existing.maxUses ?? 100,
            hasExpiry: !!existing.expiresAt,
            expiresAt: existing.expiresAt ?? "",
          }
        : emptyDefaults
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing, open]);

  const type = watch("type");

  const onSubmit = async (values: CouponFormValues) => {
    setSaving(true);
    try {
      const payload = {
        code: values.code,
        description: values.description ?? "",
        type: values.type,
        value: values.value,
        active: values.active,
        newCustomerOnly: values.newCustomerOnly,
        minOrderAmount: values.minOrderAmount,
        maxUses: values.hasMaxUses ? values.maxUses : null,
        expiresAt: values.hasExpiry && values.expiresAt ? values.expiresAt : null,
      };
      if (existing) {
        await updateCoupon(existing.id, payload);
        toast.success("Coupon updated.");
      } else {
        await createCoupon(payload);
        toast.success("Coupon created.");
      }
      onOpenChange(false);
    } catch {
      toast.error("Couldn't save — try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{existing ? "Edit coupon" : "New coupon"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Code</Label>
              <Input className="mt-1.5 uppercase" placeholder="WELCOME10" {...register("code")} />
              {errors.code && <p className="mt-1 text-xs text-destructive">{errors.code.message}</p>}
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Type</Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage off</SelectItem>
                      <SelectItem value="fixed">Fixed amount off</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <Input className="mt-1.5" placeholder="Festive weekend offer" {...register("description")} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>{type === "percentage" ? "Percentage (%)" : "Amount off (₹)"}</Label>
              <Input type="number" className="mt-1.5" {...register("value", { valueAsNumber: true })} />
            </div>
            <div>
              <Label>Minimum rental amount (₹)</Label>
              <Input type="number" className="mt-1.5" {...register("minOrderAmount", { valueAsNumber: true })} />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium">New customers only</p>
              <p className="text-xs text-muted-foreground">Blocks anyone with a prior booking.</p>
            </div>
            <Controller
              control={control}
              name="newCustomerOnly"
              render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Limit total uses</p>
                <Controller
                  control={control}
                  name="hasMaxUses"
                  render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                />
              </div>
              {watch("hasMaxUses") && (
                <Input type="number" className="mt-2" {...register("maxUses", { valueAsNumber: true })} />
              )}
            </div>
            <div className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Expiry date</p>
                <Controller
                  control={control}
                  name="hasExpiry"
                  render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                />
              </div>
              {watch("hasExpiry") && <Input type="date" className="mt-2" {...register("expiresAt")} />}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <p className="text-sm font-medium">Active</p>
            <Controller
              control={control}
              name="active"
              render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="size-4 animate-spin" />}
              {existing ? "Save changes" : "Create coupon"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function CouponsPage() {
  const { coupons, loading } = useCoupons();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Coupon | undefined>(undefined);

  const openNew = () => {
    setEditing(undefined);
    setDialogOpen(true);
  };
  const openEdit = (c: Coupon) => {
    setEditing(c);
    setDialogOpen(true);
  };

  const toggleActive = async (c: Coupon) => {
    try {
      await updateCoupon(c.id, { active: !c.active });
    } catch {
      toast.error("Couldn't update — try again.");
    }
  };

  const handleDelete = async (c: Coupon) => {
    if (!confirm(`Delete coupon ${c.code}?`)) return;
    try {
      await deleteCoupon(c.id);
      toast.success("Coupon deleted.");
    } catch {
      toast.error("Couldn't delete — try again.");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Coupons</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Codes customers can apply at checkout — festive deals, first-booking offers, and more.
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="size-4" /> New coupon
        </Button>
      </div>

      <Card className="mt-6">
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-3 p-5">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : coupons.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <BadgePercent className="size-8 text-muted-foreground" strokeWidth={1.25} />
              <p className="mt-3 font-display text-base font-semibold">No coupons yet</p>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                Create one for a festive deal or a new-customer discount.
              </p>
              <Button className="mt-4" size="sm" onClick={openNew}>
                <Plus className="size-3.5" /> New coupon
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Uses</TableHead>
                  <TableHead>Restrictions</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <button onClick={() => openEdit(c)} className="font-mono-num font-medium hover:underline">
                        {c.code}
                      </button>
                      {c.description && <p className="text-xs text-muted-foreground">{c.description}</p>}
                    </TableCell>
                    <TableCell>
                      {c.type === "percentage" ? `${c.value}% off` : `₹${c.value.toLocaleString("en-IN")} off`}
                    </TableCell>
                    <TableCell className="font-mono-num text-xs">
                      {c.usedCount} {c.maxUses !== null ? `/ ${c.maxUses}` : ""}
                    </TableCell>
                    <TableCell className="space-x-1">
                      {c.newCustomerOnly && <Badge variant="outline">New customers</Badge>}
                      {c.expiresAt && <Badge variant="outline">Exp {c.expiresAt}</Badge>}
                    </TableCell>
                    <TableCell>
                      <Switch checked={c.active} onCheckedChange={() => toggleActive(c)} />
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(c)}>
                        <Trash2 className="size-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CouponFormDialog open={dialogOpen} onOpenChange={setDialogOpen} existing={editing} />
    </div>
  );
}
