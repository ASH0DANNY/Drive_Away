export const SERVICE_FEE_RATE = 0.05;
export const DEPOSIT = 2000;

export function computePricing(pricePerDay: number, days: number) {
  const subtotal = pricePerDay * days;
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
  const total = subtotal + serviceFee + DEPOSIT;
  return { subtotal, serviceFee, deposit: DEPOSIT, total };
}
