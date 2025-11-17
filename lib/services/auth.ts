import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  address?: string;
  createdAt?: string;
}

// Sign up new user
export async function signUp(
  email: string,
  password: string,
  displayName: string
): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Update profile
    await updateProfile(user, { displayName });

    // Save user profile to Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email,
      displayName,
      createdAt: new Date().toISOString(),
    });

    return user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
}

// Sign in user
export async function signIn(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
}

// Sign out user
export async function logout(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}

// Get user profile
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

// Update user profile
export async function updateUserProfile(
  uid: string,
  updates: Partial<UserProfile>
): Promise<void> {
  try {
    const docRef = doc(db, "users", uid);
    await setDoc(docRef, updates, { merge: true });
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

// Send password reset email
export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
}
