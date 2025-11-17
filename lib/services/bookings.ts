import { db } from "@/lib/firebase";
import { Booking } from "@/types";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";

// Add a new booking
export async function createBooking(booking: Booking): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "bookings"), {
      ...booking,
      status: "pending",
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
}

// Get all bookings for a user
export async function getUserBookings(email: string): Promise<Booking[]> {
  try {
    const q = query(collection(db, "bookings"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Booking[];
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
}

// Get booking by ID
export async function getBooking(bookingId: string): Promise<Booking | null> {
  try {
    const docRef = doc(db, "bookings", bookingId);
    const docSnap = await getDocs(
      query(collection(db, "bookings"), where("__name__", "==", bookingId))
    );

    if (!docSnap.empty) {
      const booking = docSnap.docs[0].data() as Booking;
      return { id: docSnap.docs[0].id, ...booking };
    }
    return null;
  } catch (error) {
    console.error("Error fetching booking:", error);
    throw error;
  }
}

// Update booking status
export async function updateBookingStatus(
  bookingId: string,
  status: Booking["status"]
): Promise<void> {
  try {
    await updateDoc(doc(db, "bookings", bookingId), { status });
  } catch (error) {
    console.error("Error updating booking:", error);
    throw error;
  }
}

// Cancel booking
export async function cancelBooking(bookingId: string): Promise<void> {
  try {
    await updateBookingStatus(bookingId, "cancelled");
  } catch (error) {
    console.error("Error cancelling booking:", error);
    throw error;
  }
}

// Delete booking
export async function deleteBooking(bookingId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "bookings", bookingId));
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error;
  }
}
