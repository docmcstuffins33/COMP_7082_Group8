import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

// Fetch a user by ID
export const fetchUser = async (userId) => {
  try {
    const docRef = doc(db, "Users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};

// Add or update a user
export const writeUser = async (userId, userData) => {
  try {
    const docRef = doc(db, "Users", userId);
    await setDoc(docRef, userData, { merge: true });
    console.log("User updated/added:", userId);
  } catch (error) {
    console.error("Error writing user:", error);
  }
};

// Fetch a banner
export const fetchBanner = async (bannerId) => {
  try {
    const docRef = doc(db, "Banners", bannerId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching banner:", error);
  }
};

// Add or update a banner
export const writeBanner = async (bannerId, bannerData) => {
  try {
    const docRef = doc(db, "Banners", bannerId);
    await setDoc(docRef, bannerData, { merge: true });
    console.log("Banner updated/added:", bannerId);
  } catch (error) {
    console.error("Error writing banner:", error);
  }
};

// Fetch a game
export const fetchGame = async (gameId) => {
  try {
    const docRef = doc(db, "Games", gameId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching game:", error);
  }
};

// Add or update a game
export const writeGame = async (gameId, gameData) => {
  try {
    const docRef = doc(db, "Games", gameId);
    await setDoc(docRef, gameData, { merge: true });
    console.log("Game updated/added:", gameId);
  } catch (error) {
    console.error("Error writing game:", error);
  }
};
