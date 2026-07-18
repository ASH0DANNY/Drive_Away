import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type Coupon = {
  id: string;
  code: string; // stored uppercase
  description: string;
  type: "percentage" | "fixed";
  value: number;
  active: boolean;
  newCustomerOnly: boolean;
  minOrderAmount: number;
  maxUses: number | null; // null = unlimited
  usedCount: number;
  expiresAt: string | null; // yyyy-MM-dd
  createdAt?: unknown;
};

export type CouponInput = Omit<Coupon, "id" | "usedCount" | "createdAt">;

export async function createCoupon(input: CouponInput): Promise<string> {
  const ref = await addDoc(collection(db, "coupons"), {
    ...input,
    code: input.code.trim().toUpperCase(),
    usedCount: 0,
  });
  return ref.id;
}

export async function updateCoupon(id: string, input: Partial<CouponInput>): Promise<void> {
  const payload = { ...input };
  if (payload.code) payload.code = payload.code.trim().toUpperCase();
  await updateDoc(doc(db, "coupons", id), payload);
}

export async function deleteCoupon(id: string): Promise<void> {
  await deleteDoc(doc(db, "coupons", id));
}

export type CouponValidationResult =
  | { ok: true; coupon: Coupon; discountAmount: number }
  | { ok: false; message: string };

/**
 * Looks up a coupon by code and checks it against order context. Client-side
 * check for this zero-server build — fine for a small rental fleet, but note
 * usedCount increments happen at booking time (see redeemCoupon) rather than
 * inside a transaction, so there's a small race window under heavy concurrent
 * use of a maxUses-limited code.
 */
export async function validateCoupon(
  code: string,
  ctx: { subtotal: number; isFirstBooking: boolean }
): Promise<CouponValidationResult> {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return { ok: false, message: "Enter a code first." };

  const snap = await getDocs(query(collection(db, "coupons"), where("code", "==", normalized)));
  if (snap.empty) return { ok: false, message: "That code doesn't exist." };

  const couponDoc = snap.docs[0];
  const coupon = { id: couponDoc.id, ...couponDoc.data() } as Coupon;

  if (!coupon.active) return { ok: false, message: "That code isn't active anymore." };
  if (coupon.expiresAt && coupon.expiresAt < new Date().toISOString().slice(0, 10)) {
    return { ok: false, message: "That code has expired." };
  }
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    return { ok: false, message: "That code has reached its usage limit." };
  }
  if (coupon.newCustomerOnly && !ctx.isFirstBooking) {
    return { ok: false, message: "That code is reserved for first-time customers." };
  }
  if (ctx.subtotal < coupon.minOrderAmount) {
    return {
      ok: false,
      message: `Needs a minimum rental of ₹${coupon.minOrderAmount.toLocaleString("en-IN")}.`,
    };
  }

  const discountAmount =
    coupon.type === "percentage"
      ? Math.round((ctx.subtotal * coupon.value) / 100)
      : Math.min(coupon.value, ctx.subtotal);

  return { ok: true, coupon, discountAmount };
}

export async function redeemCoupon(couponId: string): Promise<void> {
  await updateDoc(doc(db, "coupons", couponId), { usedCount: increment(1) });
}

export type EligibleOffer = { coupon: Coupon; discountAmount: number };

/**
 * Fetches every active coupon and filters down to ones actually usable
 * right now for this order — same rules as validateCoupon, just applied
 * to the whole list instead of one code. Used to show "available offers"
 * at checkout instead of requiring the customer to already know a code.
 */
export async function fetchEligibleOffers(ctx: {
  subtotal: number;
  isFirstBooking: boolean;
}): Promise<EligibleOffer[]> {
  const snap = await getDocs(query(collection(db, "coupons"), where("active", "==", true)));
  const today = new Date().toISOString().slice(0, 10);

  const offers: EligibleOffer[] = [];
  for (const docSnap of snap.docs) {
    const coupon = { id: docSnap.id, ...docSnap.data() } as Coupon;
    if (coupon.expiresAt && coupon.expiresAt < today) continue;
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) continue;
    if (coupon.newCustomerOnly && !ctx.isFirstBooking) continue;
    if (ctx.subtotal < coupon.minOrderAmount) continue;

    const discountAmount =
      coupon.type === "percentage"
        ? Math.round((ctx.subtotal * coupon.value) / 100)
        : Math.min(coupon.value, ctx.subtotal);
    offers.push({ coupon, discountAmount });
  }

  return offers.sort((a, b) => b.discountAmount - a.discountAmount);
}
