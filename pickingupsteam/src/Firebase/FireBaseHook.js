
import { useDispatch, useSelector } from 'react-redux';
import {login, signOut, saveUser} from '../Redux/AccountManagement/AuthSlice';
import {fetchIcon} from '../Redux/Inventory/IconSlice';
import { fetchBackground } from '../Redux/Inventory/BackgroundSlice';
import { fetchUser, writeUser, addCredit, removeCredit, addSelectedGame, removeSelectedGame, addAchievements, removeAchievements, purchaseIconInStore, purchaseBackgroundInStore, fetchAllIcons, fetchAllBackgrounds, getImage } from '../Firebase/FirebaseUtils';
import { auth } from '../Firebase/Firebase';
import {useAuth} from '../Context/AuthContext';


// hook all the FireBaseUtils function for redux auto dispatch
export const useFirebaseHook = () => {
    const dispatch = useDispatch();
    const {user, updateUser} = useAuth();

    const startLoginHook = async (userID) => {
        const userData = await fetchUser(userID);
        if (userData) {
            dispatch(login(userData));
            return true;
        }
        return false;
    };
    const SignOutUserHook = async () => {
        auth.signOut();
        dispatch(signOut());
    };

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
    const writeUserToDBHook = async (userID, userData) => {
        if(!userData || !userID) return false;
        await writeUser(userID, userData).then(()=>{
            if(!userData) return false;
            updateUser(userData);
        });
        
        return true
    };
    //add credit to user and save state into redux
    const addCreditToUserHook = async (userID, userData, amount) => {
        if(!userID) return false;
        await addCredit(userID, userData, amount).then((userData)=>{
            if(!userData) return false;
            updateUser(userData);
        });
        return true
    };
    //remove credit from user and save state into redux
    const removeCreditFromUserHook = async (userID, userData, amount) => {
        if(!userID) return false;
        await removeCredit(userID, userData, amount).then((userData)=>{
            if(!userData) return false;
            updateUser(userData);
        });
        return true
    };
    const addSelectedGameHook = async (userID, userData, selectedGame) => {
        if(!userID) return false;
        await addSelectedGame(userID, userData, selectedGame).then((userData) => {
            if(!userData) return false;
            updateUser(userData);
        })
    }
    const removeSelectedGameHook = async (userID, userData) => {
        if(!userID) return false;
        await removeSelectedGame(userID, userData).then((userData) => {
            if(!userData) return false;
            updateUser(userData);
            console.log(userData);
        })
    }
    const addAchievementsHook = async (userID, userData, achievements) => {
        if(!userID) return false;
        await addAchievements(userID, userData, achievements).then((userData) => {
            if(!userData) return false;
            updateUser(userData);
        })
    }
    const removeAchievementsHook = async (userID, userData) => {
        if(!userID) return false;
        await removeAchievements(userID, userData).then((userData) => {
            if(!userData) return false;
            updateUser(userData);
        })
    }
    //load icon and save state into redux
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
    //load background and save state into redux
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
    //purchase icon and save user state into redux
    const purchaseIconInStoreHook = async (userID, userData, item) => {
        if(!userID) return false;
        await purchaseIconInStore(userID, userData, item).then((userData)=>{
            if(!userData) return false
            updateUser(userData);
        });
        return true
    };
    //purchase background and save user state into redux
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