
import { useDispatch, useSelector } from 'react-redux';
import {login, signOut, saveUser} from '../Redux/AccountManagement/AuthSlice';
import { fetchUser, writeUser, addCredit, removeCredit } from '../Firebase/FirebaseUtils';
import { auth } from '../Firebase/Firebase';


// hook all the FireBaseUtils function for redux auto dispatch
export const useFirebaseHook = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    const startLogin = async (userID) => {
        const userData = await fetchUser(userID);
        if (userData) {
            dispatch(login(userData));
            return true;
        }
        return false;
    };
    const SignOutUser = async () => {
        auth.signOut();
        dispatch(signOut());
    };

    const fetchUserById = async (userID) => {
        const userData = await fetchUser(userID);
        if (userData) {
            dispatch(saveUser(userData));
            return true;
        }
        else{
            return false;
        }
    };
    const writeUserToDB = async (userID, userData) => {
        if(!userData || !userID) return false;
        await writeUser(userID, userData).then(()=>{
            dispatch(saveUser(userData));
        });
        
        return true
    };

    const addCreditToUser = async (userID, userData, amount) => {
        if(!userID) return false;

        await addCredit(userID, userData, amount).then((userData)=>{
            dispatch(saveUser(userData));
        });
        return true
    };

    const removeCreditFromUser = async (userID, userData, amount) => {
        if(!userID) return false;
        await removeCredit(userID, userData, amount).then((userData)=>{
            dispatch(saveUser(userData));
        });
        return true
    };

    return { user, fetchUserById, writeUserToDB, addCreditToUser, removeCreditFromUser, SignOutUser, startLogin };
};