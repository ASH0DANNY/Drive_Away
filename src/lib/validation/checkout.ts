import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Enter the driver's full name"),
  customerPhone: z
    .string()
    .min(10, "Enter a valid phone number")
    .max(15, "Enter a valid phone number"),
  licenseNumber: z.string().min(4, "Enter your driving license number"),
  agree: z.literal(true, { message: "You need to accept the rental terms" }),
});
export type CheckoutValues = z.infer<typeof checkoutSchema>;
