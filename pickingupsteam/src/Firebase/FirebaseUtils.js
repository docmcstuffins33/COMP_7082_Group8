import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./Firebase";

// Fetch by ID
// collection - Users, Games, Icons, Banners
export const fetchUser = async (UserID) => {
    try {
        const docRef = doc(db, "Users", UserID);
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
export const writeUser = async (userID, userData) => {
    try {
        const docRef = doc(db, "Users", userID);
        await setDoc(docRef, userData, { merge: true });
        console.log("Collection updated/added:", userID);
    } catch (error) {
        console.error("Error writing to collection:", error);
    }
};


export const addCredit = async (userID, userData, amount) => {
    try {
        const docRef = doc(db, "Users", userID);
        let newAmount = userData.Points != null ? userData.Points + amount : 0
        let newUserData = {...userData, Points: newAmount };
        await setDoc(docRef, newUserData, { merge: true });
        console.log("Collection updated/added:", userID);
        return newUserData;
    } catch (error) {
        console.error("Error writing to collection:", error);
        return null;
    }
}
export const removeCredit = async (userID, userData, amount) => {
    try {
        const docRef = doc(db, "Users", userID);
        let newAmount = userData.Points != null ? userData.Points - amount : 0
        let newUserData = {...userData, Points: newAmount };

        await setDoc(docRef, newUserData, { merge: true });
        return newUserData;
    } catch (error) {
        console.error("Error writing to collection:", error);
        return null;
    }
}