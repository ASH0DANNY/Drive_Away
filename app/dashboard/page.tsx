"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { Booking, User } from "@/types";
import {
  openInvoicePreview,
  downloadInvoice,
} from "@/lib/services/invoiceService";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import {
  openBookingReport,
  downloadBookingReport,
} from "@/lib/services/reportService";
import {
  FiLogOut,
  FiEdit2,
  FiDownload,
  FiEye,
  FiCalendar,
  FiMapPin,
  FiDollarSign,
  FiUser,
  FiMail,
  FiPhone,
  FiFileText,
} from "react-icons/fi";
import "../animations.css";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<(Booking & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "bookings" | "reports" | "profile"
  >("overview");

  const scrollRef = useScrollAnimation({ threshold: 0.1, triggerOnce: false });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/signin");
        return;
      }

      try {
        // Get user profile from Firestore
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUser({ ...userDoc.data() } as User);

          // Get user bookings
          const bookingsQuery = query(
            collection(db, "bookings"),
            where("email", "==", currentUser.email)
          );
          const bookingsSnapshot = await getDocs(bookingsQuery);
          const bookingsList = bookingsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as (Booking & { id: string })[];

          setBookings(
            bookingsList.sort(
              (a, b) =>
                new Date(b.createdAt || 0).getTime() -
                new Date(a.createdAt || 0).getTime()
            )
          );
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/signin");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleViewInvoice = (booking: Booking & { id: string }) => {
    const invoiceData = {
      ...booking,
      companyName: process.env.NEXT_PUBLIC_APP_NAME,
      companyEmail: process.env.NEXT_PUBLIC_APP_EMAIL,
      companyPhone: process.env.NEXT_PUBLIC_APP_PHONE,
      companyAddress: process.env.NEXT_PUBLIC_APP_ADDRESS,
      invoiceNumber: `INV-${
        booking.id?.slice(0, 8).toUpperCase() || "UNKNOWN"
      }`,
    };
    openInvoicePreview(invoiceData);
  };

  const handleDownloadInvoice = (booking: Booking & { id: string }) => {
    const invoiceData = {
      ...booking,
      companyName: process.env.NEXT_PUBLIC_APP_NAME,
      companyEmail: process.env.NEXT_PUBLIC_APP_EMAIL,
      companyPhone: process.env.NEXT_PUBLIC_APP_PHONE,
      companyAddress: process.env.NEXT_PUBLIC_APP_ADDRESS,
      invoiceNumber: `INV-${
        booking.id?.slice(0, 8).toUpperCase() || "UNKNOWN"
      }`,
    };
    downloadInvoice(invoiceData);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div ref={scrollRef} className="scroll-animate slide-left">
            <h1 className="text-2xl font-bold text-black">Drive Away</h1>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <FiLogOut /> Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div ref={scrollRef} className="scroll-animate slide-up mb-12">
          <h2 className="text-4xl font-bold text-black mb-4">
            Welcome, {user.firstName}!
          </h2>
          <p className="text-gray-600">Manage your bookings and profile</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          {["overview", "bookings", "reports", "profile"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 font-semibold transition-colors capitalize ${
                activeTab === tab
                  ? "text-black border-b-2 border-black"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Stats Cards */}
            <div
              ref={scrollRef}
              className="scroll-animate slide-up bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Bookings</p>
                  <p className="text-3xl font-bold text-black">
                    {bookings.length}
                  </p>
                </div>
                <div className="bg-blue-100 p-4 rounded-full">
                  <FiCalendar className="text-blue-600 text-2xl" />
                </div>
              </div>
            </div>

            <div
              ref={scrollRef}
              className="scroll-animate slide-up bg-white rounded-lg shadow-lg p-6"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Active Bookings</p>
                  <p className="text-3xl font-bold text-black">
                    {
                      bookings.filter(
                        (b) =>
                          b.status === "confirmed" || b.status === "in-progress"
                      ).length
                    }
                  </p>
                </div>
                <div className="bg-green-100 p-4 rounded-full">
                  <FiMapPin className="text-green-600 text-2xl" />
                </div>
              </div>
            </div>

            <div
              ref={scrollRef}
              className="scroll-animate slide-up bg-white rounded-lg shadow-lg p-6"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Spent</p>
                  <p className="text-3xl font-bold text-black">
                    $
                    {bookings
                      .reduce((sum, b) => sum + (b.totalPrice || 0), 0)
                      .toFixed(2)}
                  </p>
                </div>
                <div className="bg-purple-100 p-4 rounded-full">
                  <FiDollarSign className="text-purple-600 text-2xl" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div ref={scrollRef} className="scroll-animate fade-in">
            {bookings.length === 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <p className="text-gray-600 mb-4">No bookings yet</p>
                <Link
                  href="/"
                  className="text-black font-semibold hover:underline"
                >
                  Start a new booking
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking, index) => (
                  <div
                    key={booking.id}
                    className="scroll-animate slide-up bg-white rounded-lg shadow-lg p-6"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-gray-600 text-sm">Vehicle</p>
                        <p className="text-black font-semibold">
                          {booking.vehicleName || booking.vehicleType}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Pickup</p>
                        <p className="text-black font-semibold">
                          {booking.pickupDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Return</p>
                        <p className="text-black font-semibold">
                          {booking.returnDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Price</p>
                        <p className="text-black font-semibold">
                          ${booking.totalPrice?.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center justify-between">
                      <div className="flex gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            booking.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "confirmed"
                              ? "bg-blue-100 text-blue-800"
                              : booking.status === "in-progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            booking.paymentStatus === "completed"
                              ? "bg-green-100 text-green-800"
                              : booking.paymentStatus === "partial"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {booking.paymentStatus}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewInvoice(booking)}
                          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                          title="View Invoice"
                        >
                          <FiEye size={18} /> Preview
                        </button>
                        <button
                          onClick={() => handleDownloadInvoice(booking)}
                          className="flex items-center gap-2 bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                          title="Download Invoice"
                        >
                          <FiDownload size={18} /> Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div ref={scrollRef} className="scroll-animate fade-in">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
              <h3 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
                <FiFileText /> Generate Reports
              </h3>

              <p className="text-gray-600 mb-6">
                Generate comprehensive reports of your bookings and rental
                history.
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => {
                    openBookingReport({
                      userEmail: user.email,
                      userName: user.displayName,
                      bookings,
                      generatedDate: new Date(),
                    });
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <FiEye /> View Report
                </button>

                <button
                  onClick={() => {
                    downloadBookingReport({
                      userEmail: user.email,
                      userName: user.displayName,
                      bookings,
                      generatedDate: new Date(),
                    });
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-gray-200 text-black px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <FiDownload /> Download Report
                </button>
              </div>

              {bookings.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Report Summary
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600 text-sm">Total Bookings</p>
                      <p className="text-2xl font-bold text-black">
                        {bookings.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">
                        Completed Bookings
                      </p>
                      <p className="text-2xl font-bold text-black">
                        {
                          bookings.filter((b) => b.status === "completed")
                            .length
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">
                        Total Amount Spent
                      </p>
                      <p className="text-2xl font-bold text-black">
                        $
                        {bookings
                          .reduce((sum, b) => sum + (b.totalPrice || 0), 0)
                          .toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Total Days</p>
                      <p className="text-2xl font-bold text-black">
                        {bookings.reduce(
                          (sum, b) => sum + (b.totalDays || 0),
                          0
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div ref={scrollRef} className="scroll-animate fade-in">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
              <h3 className="text-2xl font-bold text-black mb-6">
                Profile Information
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                    <FiUser /> Full Name
                  </label>
                  <p className="text-black">{user.displayName}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                    <FiMail /> Email
                  </label>
                  <p className="text-black">{user.email}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                    <FiPhone /> Phone
                  </label>
                  <p className="text-black">{user.phone || "Not provided"}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Member Since
                  </label>
                  <p className="text-black">
                    {user.createdAt
                      ? typeof user.createdAt === "string"
                        ? new Date(user.createdAt).toLocaleDateString()
                        : new Date(
                            (user.createdAt as any).seconds * 1000
                          ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                <div className="pt-4">
                  <button className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                    <FiEdit2 /> Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
