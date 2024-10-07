import React from 'react'
import './MainCreditPage.css'
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect} from 'react';
import { addCredit, removeCredit } from '../../../Firebase/FirebaseUtils';
import { auth } from '../../../Firebase/Firebase';
import{ useFirebaseHook } from '../../../Firebase/FireBaseHook'

const MainCreditPage = () => {
    const {user, isAuthenticated} = useSelector(state => state.auth);
    const [credit, setCredit] = useState(0);

    const {addCreditToUser, removeCreditFromUser } = useFirebaseHook();
    

    useEffect(() => {
        if(user){
            console.log("Current Credit: " + user.Points);
            setCredit(user.Points);
        }
    }, [user]);

    const AddCredit = () => {
        if(isAuthenticated){
            const authUser = auth.currentUser;
            addCreditToUser(authUser.uid, user, 10);

        }
    }
    const MinusCredit = () => {
        if(isAuthenticated){
            const authUser = auth.currentUser;
            removeCreditFromUser(authUser.uid, user, 10);
        }
    }
    return (
        <div class="credit__container">
            <h1>CurrentCredit: {credit}</h1>
            <button class ="credit__add-button" onClick={AddCredit}>AddCredit</button>
            <button  class ="credit__add-button" onClick={MinusCredit}>MinusCredit</button>
        
        </div>
    )
}

export default MainCreditPage