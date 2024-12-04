import { collection, doc, getDoc, setDoc, getDocs, updateDoc, deleteField } from "firebase/firestore";
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

// Fetch all icon decorations for the shop
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

//Fetch all backgrounds for the shop
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

//Fetches and image from the DB
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

//Fetches a user's profile picture from the DB
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

//Get the user's currently selected theme
export const getSelectedTheme = async(UserID) => {
    try {
        const docRef = doc(db, "Users", UserID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const userData = docSnap.data();
            const themes = userData.Inventory.Banners || [];
            const selectedTheme = themes.find((theme) => theme.isSelected == true);
            if(selectedTheme){
                return selectedTheme;
            } else {
                console.log("no theme is selected")
                return null;
            }
        } else {
        console.log("Data does not exist");
        return null;
        }
    } catch (error) {
        console.error("Error fetching from collection:", error);
    }
}

//Set which theme is currently selected for the user in the DB
export const setSelectedTheme = async(themeName, UserID) => {
    try {
        const docRef = doc(db, "Users", UserID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const userData = docSnap.data();
            const themes = userData.Inventory.Banners || [];
            const updatedThemes = themes.map((theme) => ({
                ...theme,
                isSelected: theme.name === themeName,
            }));
            await updateDoc(docRef, {
                "Inventory.Banners": updatedThemes,
            });
        } else {
        console.log("Data does not exist");
        return null;
        }
    } catch (error) {
        console.error("Error updating collection:", error);
    }
}

//Get the user's currently selected icon decoration
export const getSelectedDeco = async(UserID) => {
    try {
        const docRef = doc(db, "Users", UserID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const userData = docSnap.data();
            const decos = userData.Inventory.Icons || [];
            const selectedDeco = decos.find((dec) => dec.isSelected == true);
            if(selectedDeco){
                return selectedDeco;
            } else {
                console.log("no theme is selected")
                return null;
            }
        } else {
        console.log("Data does not exist");
        return null;
        }
    } catch (error) {
        console.error("Error fetching from collection:", error);
    }
}

//Set the user's currently selected icon decoration in the DB
export const setSelectedDeco = async(decName, UserID) => {
    try {
        const docRef = doc(db, "Users", UserID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const userData = docSnap.data();
            const decos = userData.Inventory.Icons || [];
            const updatedDecos = decos.map((dec) => ({
                ...dec,
                isSelected: dec.name === decName,
            }));
            await updateDoc(docRef, {
                "Inventory.Icons": updatedDecos,
            });
        } else {
        console.log("Data does not exist");
        return null;
        }
    } catch (error) {
        console.error("Error updating collection:", error);
    }
}

//Get the user's currently selected icon decoration in DB
export const getSelectedDecoration = async(UserID) => {
    try {
        const docRef = doc(db, "Users", UserID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const userData = docSnap.data();
            const decos = userData.Inventory.Icons || [];
            const selectedDeco = decos.find((dec) => dec.isSelected == true);
            if(selectedDeco){
                return selectedDeco;
            } else {
                console.log("no theme is selected")
                return null;
            }
        } else {
        console.log("Data does not exist");
        return null;
        }
    } catch (error) {
        console.error("Error fetching from collection:", error);
    }
}


//Upload a profile picture for a user in the DB
export const uploadProfilePic = async (file, userID, userData) => {
    try{
        const filename = "ProfilePictures/" + userID + ".png";
        const fileRef = ref(storage, filename);
    
        const snapshot = await uploadBytes(fileRef, file);
        var newData = userData;
        newData.photoURL = filename;
        return await writeUser(userID, newData)
    }catch (error) {
        console.error("Error writing to collection:", error);
    }
}

//Add credits to a user's account
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

//Remove credits from the user's account
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

//Add currently selected game into a user's account
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

//Remove currently selected game from a user's account and give them points
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

//Add achievements into the user's account
export const addAchievements = async (userID, userData, achievements) => {
    try {
        const docRef = doc(db, "Users", userID);
        let newUserData = {...userData, Achievements: Object.fromEntries(achievements)};
        await setDoc(docRef, newUserData, {merge: true});
        return newUserData;
    } catch (error) {
        console.error("Error writing into collection:", error);
        return null;
    }
}

//Remove achievements from the user's account
export const removeAchievements = async (userID, userData) => {
    try {
        const docRef = doc(db, "Users", userID);
        let newUserData = {...userData, Achievements: null};
        await setDoc(docRef, newUserData, {merge: true});
        return newUserData;
    } catch (error) {
        console.error("Error writing into collection:", error);
        return null;
    }
}

//Add purchased background decoration into user's account and remove corresponding points
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

//Add purchased icon into user's account and remove corresponding points
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