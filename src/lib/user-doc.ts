import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "@/lib/firebase";

export type UserRole = "customer" | "admin";

export type UserDoc = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  createdAt?: unknown;
};

/**
 * Ensures a users/{uid} doc exists for this auth user. Never overwrites an
 * existing role — role is only ever changed manually by an admin from the
 * Users Manager, never self-assigned by the client.
 */
export async function ensureUserDoc(user: User): Promise<void> {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return;

  const newUser: UserDoc = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    role: "customer",
  };

  await setDoc(ref, { ...newUser, createdAt: serverTimestamp() });
}

export async function getUserDoc(uid: string): Promise<UserDoc | null> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data() as UserDoc) : null;
}
