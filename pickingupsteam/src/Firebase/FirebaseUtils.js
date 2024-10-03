import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

// Fetch by ID
// collection - Users, Games, Icons, Banners
export const fetchUser = async (collection, collectionId) => {
  try {
    const docRef = doc(db, collection, collectionId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("Data does not exist");
      return null;
    }
  } catch (error) {
    console.error("Error fetching from collection:", error);
  }
};

// Add or update by ID
export const writeUser = async (collection, collectionId, collectionData) => {
  try {
    const docRef = doc(db, collection, collectionId);
    await setDoc(docRef, collectionData, { merge: true });
    console.log("Collection updated/added:", collectionId);
  } catch (error) {
    console.error("Error writing to collection:", error);
  }
};
