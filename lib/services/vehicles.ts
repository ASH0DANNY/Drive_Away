import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";

export interface Vehicle {
  id?: string;
  name: string;
  type: "car" | "bike";
  category: string;
  price: number;
  image: string;
  description: string;
  features: string[];
  isAvailable: boolean;
  createdAt?: Timestamp;
}

// Get all available vehicles
export async function getAvailableVehicles(): Promise<Vehicle[]> {
  try {
    const q = query(
      collection(db, "vehicles"),
      where("isAvailable", "==", true)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Vehicle[];
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    throw error;
  }
}

// Get vehicles by type
export async function getVehiclesByType(
  type: "car" | "bike"
): Promise<Vehicle[]> {
  try {
    const q = query(
      collection(db, "vehicles"),
      where("type", "==", type),
      where("isAvailable", "==", true)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Vehicle[];
  } catch (error) {
    console.error("Error fetching vehicles by type:", error);
    throw error;
  }
}

// Get all vehicles (including unavailable)
export async function getAllVehicles(): Promise<Vehicle[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "vehicles"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Vehicle[];
  } catch (error) {
    console.error("Error fetching all vehicles:", error);
    throw error;
  }
}

// Add a new vehicle
export async function addVehicle(vehicle: Vehicle): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "vehicles"), {
      ...vehicle,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding vehicle:", error);
    throw error;
  }
}

// Update vehicle availability
export async function updateVehicleAvailability(
  vehicleId: string,
  isAvailable: boolean
): Promise<void> {
  try {
    await updateDoc(doc(db, "vehicles", vehicleId), { isAvailable });
  } catch (error) {
    console.error("Error updating vehicle:", error);
    throw error;
  }
}
