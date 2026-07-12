import { addDoc, collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Vehicle } from "@/lib/default-content";

export type VehicleInput = Omit<Vehicle, "id">;

export async function createVehicle(input: VehicleInput): Promise<string> {
  const ref = await addDoc(collection(db, "vehicles"), input);
  return ref.id;
}

export async function updateVehicle(id: string, input: VehicleInput): Promise<void> {
  await setDoc(doc(db, "vehicles", id), input);
}

export async function deleteVehicle(id: string): Promise<void> {
  await deleteDoc(doc(db, "vehicles", id));
}
