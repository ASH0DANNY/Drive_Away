import { z } from "zod";

export const vehicleSchema = z.object({
  type: z.enum(["car", "bike"]),
  name: z.string().min(2, "Enter a name"),
  category: z.string().min(2, "Enter a category"),
  pricePerDay: z.number().min(1, "Enter a price"),
  images: z.array(z.string()),
  transmission: z.enum(["Manual", "Automatic"]),
  fuel: z.enum(["Petrol", "Diesel", "Electric"]),
  seats: z.number().min(1).max(10),
  rating: z.number().min(0).max(5),
  location: z.string().min(2, "Enter a city"),
  available: z.boolean(),
  description: z.string().optional(),
  featuresText: z.string().optional(),
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;
