import { collection, doc, getDoc, setDoc, getDocs, deleteField } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { db, storage } from "./Firebase";

// Fetch by ID
// collection - Users, Games, Icons, Backgrounds
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

export const fetchAllIcons = async () => {
    try {
        const docSnap = await getDocs(collection(db, 'Icons'));
        if (!docSnap.empty) {
            const data = docSnap.docs.map(doc => doc.data());
            // console.log(data);
            return data;
        } else {
            console.log("Data does not exist");
            return null;
        }
    } catch (error) {
        console.error("Error fetching from collection:", error);
    }
};

export const fetchAllBackgrounds = async () => {
    try {
        const docSnap = await getDocs(collection(db, 'Backgrounds'));
        if (!docSnap.empty) {
            const data = docSnap.docs.map(doc => doc.data());
            // console.log(data);
            return data;
        } else {
            console.log("Data does not exist");
            return null;
        }
    } catch (error) {
        console.error("Error fetching from collection:", error);
    }
};

export const getImage = async (name) => {
    try {
        const url = await getDownloadURL(ref(storage, name))
        if (url) {
            return url;
        } else {
            console.log("URL does not exist");
            return null;
        }
    } catch (error) {
        console.error("Error fetching image:", error);
    }
}

export const getProfilePic = async (name) => {
    try {
        const path = name
        const url = await getDownloadURL(ref(storage, path))
        if (url) {
            return url;
        } else {
            console.log("URL does not exist");
            return null;
        }
    } catch (error) {
        console.error("Error fetching image:", error);
    }
}

export const uploadProfilePic = async (file, userID, userData, setLoading) => {
    const filename = "ProfilePictures/" + userID + ".png";
    const fileRef = ref(storage, filename);
    setLoading(true);
    const snapshot = await uploadBytes(fileRef, file);
    var newData = userData;
    newData.photoURL = filename;
    writeUser(userID, newData)
    setLoading(false);
    alert("Profile Picture uploaded!")
}


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

export const addSelectedGame = async (userID, userData, selectedGame) => {
    try {
        const docRef = doc(db, "Users", userID);
        let newUserData = {...userData, SelectedGame: selectedGame};
        await setDoc(docRef, newUserData, {merge:true});
        return newUserData;
    } catch (error) {
        console.error("Error writing into collection:", error);
        return null;
    }
}

export const removeSelectedGame = async (userID, userData) => {
    try {
        const docRef = doc(db, "Users", userID);
        let newAmount = userData.Points != null ? userData.Points + 200 : 200
        let newUserData = {...userData, SelectedGame: null, Points: newAmount};
        await setDoc(docRef, newUserData, {merge:true});
        return newUserData;
    }catch (error) {
        console.error("Error writing into collection:", error);
        return null;
    }
}

export const purchaseBackgroundInStore = async (userID, userData, item) => {
    try {
        const docRef = doc(db, "Users", userID);
        let updatedBG = [...userData.Inventory.Banners, item];
        let newUserData = {
            ...userData,
            Inventory: {
                ...userData.Inventory,
                Banners: updatedBG
            },
            Points: userData.Points - item.cost
        };
        console.log("_______________________________________________newUserData_______________________________________________")
        console.log(userData.Points)
        console.log(item.cost)
        console.log(newUserData)
        console.log("_______________________________________________newUserData_______________________________________________")
        await setDoc(docRef, newUserData, { merge: true });
        return newUserData;
    } catch (error) {
        console.error("Error writing to collection:", error);
        return null;
    }
}

export const purchaseIconInStore = async (userID, userData, item) => {
    try {
        const docRef = doc(db, "Users", userID);
        let updatedIcons = [...userData.Inventory.Icons, item];

        let newUserData = {
            ...userData,
            Inventory: {
                ...userData.Inventory,
                Icons: updatedIcons
            },
            Points: userData.Points - item.cost
        };
        console.log("_______________________________________________newUserData_______________________________________________")
        console.log(userData.Points)
        console.log(item.cost)
        console.log(newUserData)
        console.log("_______________________________________________newUserData_______________________________________________")
        await setDoc(docRef, newUserData, { merge: true });
        return newUserData;
    } catch (error) {
        console.error("Error writing to collection:", error);
        return null;
    }
}