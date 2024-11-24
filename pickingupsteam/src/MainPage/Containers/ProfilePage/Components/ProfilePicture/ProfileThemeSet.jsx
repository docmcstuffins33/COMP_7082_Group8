import React, {useEffect, useState} from 'react';
import '../../../StorePage/Store.css'
import { useSelector } from 'react-redux';
import { useAuth } from '../../../../../Context/AuthContext';
import { auth } from '../../../../../Firebase/Firebase';
import { setSelectedTheme } from '../../../../../Firebase/FirebaseUtils';

function ProfileThemeSet({theme}) {

    const {user} = useAuth();
    const [isPurchased, setIsPurchased] = useState(false);  
    useEffect(() => {
        if(!user) return;

        // console.log(user.Inventory.Banners.filter(icon => icon.name === decorations.name));

        // If the user has the background, set isPurchased to true
        if(!user.Inventory.Banners || user.Inventory.Banners.length === 0) return;
        console.log(user)
        if(theme.isSelected == true){
            setIsPurchased(true);
        }else{
            setIsPurchased(false);
        }
    },[user])

    const themeSetter = async () => {
        await setSelectedTheme(theme.name, auth.currentUser.uid)
        window.location.reload();
    }

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