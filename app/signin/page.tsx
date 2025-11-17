"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword, signInAnonymously } from "firebase/auth";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { FiMail, FiLock } from "react-icons/fi";

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!email.trim()) {
        throw new Error("Email is required");
      }
      if (!password) {
        throw new Error("Password is required");
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      // Update last login
      await updateDoc(doc(db, "users", userCredential.user.uid), {
        lastLogin: Timestamp.now(),
      });

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      const errorMessage = err.message || "Failed to sign in";
      setError(errorMessage);
      console.error("Sign in error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAccess = async () => {
    setLoading(true);
    setError("");

    try {
      await signInAnonymously(auth);
      router.push("/dashboard");
    } catch (err: any) {
      const errorMessage = err.message || "Failed to access as guest";
      setError(errorMessage);
      console.error("Guest sign in error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Drive Away</h1>
          <p className="text-gray-600">Welcome back</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}

        {/* Sign In Form */}
        <form
          onSubmit={handleSignIn}
          className="bg-white rounded-lg shadow-lg p-8 space-y-4 mb-4"
        >
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="john@example.com"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link href="#" className="text-sm text-black hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Guest Access Button */}
        <button
          onClick={handleGuestAccess}
          disabled={loading}
          className="w-full bg-gray-200 text-black py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          Continue as Guest
        </button>

        {/* Sign Up Link */}
        <p className="text-center text-gray-600 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-black font-semibold hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
