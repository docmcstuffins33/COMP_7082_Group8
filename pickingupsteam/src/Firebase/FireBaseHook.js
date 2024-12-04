
import { useDispatch, useSelector } from 'react-redux';
import {login, signOut, saveUser} from '../Redux/AccountManagement/AuthSlice';
import {fetchIcon} from '../Redux/Inventory/IconSlice';
import { fetchBackground } from '../Redux/Inventory/BackgroundSlice';
import { fetchUser, writeUser, addCredit, removeCredit, addSelectedGame, removeSelectedGame, addAchievements, removeAchievements, purchaseIconInStore, purchaseBackgroundInStore, fetchAllIcons, fetchAllBackgrounds, getImage } from '../Firebase/FirebaseUtils';
import { auth } from '../Firebase/Firebase';
import {useAuth} from '../Context/AuthContext';


// Update Authcontext when Firebase is updated
export const useFirebaseHook = () => {
    const dispatch = useDispatch();
    const {user, updateUser} = useAuth();

    //Login user
    const startLoginHook = async (userID) => {
        const userData = await fetchUser(userID);
        if (userData) {
            dispatch(login(userData));
            return true;
        }
        return false;
    };
    //Signout user
    const SignOutUserHook = async () => {
        auth.signOut();
        dispatch(signOut());
    };

    //Get user info from Firebase from their UserID
    const fetchUserByIdHook = async (userID) => {
        const userData = await fetchUser(userID);
        if (userData) {
            dispatch(saveUser(userData));
            return true;
        }
        else{
            return false;
        }
    };
    //Add a user to Firebase authentication
    const writeUserToDBHook = async (userID, userData) => {
        if(!userData || !userID) return false;
        await writeUser(userID, userData).then(()=>{
            if(!userData) return false;
            updateUser(userData);
        });
        
        return true
    };
    //add credit to user and save state into Authcontext
    const addCreditToUserHook = async (userID, userData, amount) => {
        if(!userID) return false;
        await addCredit(userID, userData, amount).then((userData)=>{
            if(!userData) return false;
            updateUser(userData);
        });
        return true
    };
    //remove credit from user and save state into Authcontext
    const removeCreditFromUserHook = async (userID, userData, amount) => {
        if(!userID) return false;
        await removeCredit(userID, userData, amount).then((userData)=>{
            if(!userData) return false;
            updateUser(userData);
        });
        return true
    };
    //Add selected game into user account (The game that they are going to complete for points)
    const addSelectedGameHook = async (userID, userData, selectedGame) => {
        if(!userID) return false;
        await addSelectedGame(userID, userData, selectedGame).then((userData) => {
            if(!userData) return false;
            updateUser(userData);
        })
    }
    //Remove selected game from account, usually when claiming for points
    const removeSelectedGameHook = async (userID, userData) => {
        if(!userID) return false;
        await removeSelectedGame(userID, userData).then((userData) => {
            if(!userData) return false;
            updateUser(userData);
            console.log(userData);
        })
    }
    //Add current random achievements into account
    const addAchievementsHook = async (userID, userData, achievements) => {
        if(!userID) return false;
        await addAchievements(userID, userData, achievements).then((userData) => {
            if(!userData) return false;
            updateUser(userData);
        })
    }
    //Remove currently selected achievements from account
    const removeAchievementsHook = async (userID, userData) => {
        if(!userID) return false;
        await removeAchievements(userID, userData).then((userData) => {
            if(!userData) return false;
            updateUser(userData);
        })
    }
    //Load selected icon decoration from DB
    const getIconsHook = async () => {
        await fetchAllIcons().then(async (data) => {
            try{
                //load image
                const imgPromises = data.map(async data => {
                    const downloadPath = await getImage(data.path);
                    return { name: data.name, cost: data.cost, img: downloadPath, type: "icon" };
                });
                const newIcons = await Promise.all(imgPromises);
                dispatch(fetchIcon(newIcons));
            }catch(error){
                console.log(error);
            }
            
        });
    }
    //Load current selected background from DB
    const getBackgroundHook = async () => {
        await fetchAllBackgrounds().then(async (data) => {
            try{
                const bgPromises = data.map(async bg => {
                    const downloadPath = await getImage(bg.path);
                    return { name: bg.name, cost: bg.cost, img: downloadPath, type: "bg" };
                });
                const newBgs = await Promise.all(bgPromises);
                dispatch(fetchBackground(newBgs));
            }catch(error){
                console.log(error);
            }
            
        });
    }
    //Add icon decoration to user's owned list in DB
    const purchaseIconInStoreHook = async (userID, userData, item) => {
        if(!userID) return false;
        await purchaseIconInStore(userID, userData, item).then((userData)=>{
            if(!userData) return false
            updateUser(userData);
        });
        return true
    };
    //Add purchased background into user account
    const purchaseBackgroundInStoreHook = async (userID, userData, item) => {
        if(!userID) return false;
        await purchaseBackgroundInStore(userID, userData, item).then((userData)=>{
            if(!userData) return false
            updateUser(userData);
        });
        return true
    }
    
    return { user, fetchUserById: fetchUserByIdHook, writeUserToDB: writeUserToDBHook,
        addCreditToUser: addCreditToUserHook, removeCreditFromUser: removeCreditFromUserHook, addSelectedGame: addSelectedGameHook,
        removeSelectedGame: removeSelectedGameHook, addAchievements: addAchievementsHook, removeAchievements: removeAchievementsHook, 
        SignOutUser: SignOutUserHook, startLogin: startLoginHook, purchaseIconInStore: purchaseIconInStoreHook, 
        purchaseBackgroundInStore: purchaseBackgroundInStoreHook, getIcon: getIconsHook, getBackground: getBackgroundHook};
};