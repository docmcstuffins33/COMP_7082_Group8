import React, {useEffect, useState} from 'react';
import '../../../StorePage/Store.css'
import { useSelector } from 'react-redux';
import { useAuth } from '../../../../../Context/AuthContext';
import { auth } from '../../../../../Firebase/Firebase';
import { setSelectedTheme } from '../../../../../Firebase/FirebaseUtils';

/*The setter panel for a profile theme, as seen on the Profile page. Takes in a prop "theme" which is the profile theme to be displayed within this component.*/
function ProfileThemeSet({theme}) {

    const {user} = useAuth();
    const [isPurchased, setIsPurchased] = useState(false);  

    //Gets the user's currently selected profile theme.
    useEffect(() => {
        if(!user) return;
        // If the user has the background, set isPurchased to true
        if(!user.Inventory.Banners || user.Inventory.Banners.length === 0) return;
        if(theme.isSelected == true){
            setIsPurchased(true);
        }else{
            setIsPurchased(false);
        }
    },[user])

    //Set the user's selected theme to the one corresponding with this component.
    const themeSetter = async () => {
        await setSelectedTheme(theme.name, auth.currentUser.uid)
        window.location.reload();
    }

    /*----Actual theme setter layout starts here----*/
    return (
        <div className='decoHolder'> 
            <div key={theme.name}>
                <img className="bg" src={theme.img} alt={theme.name} />
                <p>{theme.name}</p>
                {isPurchased? 
                <>
                    <button className='itemCost purchased' onClick={themeSetter} disabled>Selected</button>  
                </>: 
                <>
                    <button className='itemCost unpurchased' onClick={themeSetter}>Select</button>
                </>}
            </div>
        </div>
    );
}

export default ProfileThemeSet;