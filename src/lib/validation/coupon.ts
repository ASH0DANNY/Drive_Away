import { z } from "zod";

export const couponSchema = z.object({
  code: z.string().min(3, "At least 3 characters"),
  description: z.string().optional(),
  type: z.enum(["percentage", "fixed"]),
  value: z.number().min(1, "Enter a value"),
  active: z.boolean(),
  newCustomerOnly: z.boolean(),
  minOrderAmount: z.number().min(0),
  hasMaxUses: z.boolean(),
  maxUses: z.number().min(1),
  hasExpiry: z.boolean(),
  expiresAt: z.string().optional(),
});

export type CouponFormValues = z.infer<typeof couponSchema>;
