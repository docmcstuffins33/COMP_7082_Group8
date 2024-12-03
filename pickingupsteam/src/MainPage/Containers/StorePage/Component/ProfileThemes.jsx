import React, {useEffect, useState} from 'react';
import '../Store.css';
import { useSelector } from 'react-redux';
import { useAuth } from '../../../../Context/AuthContext';

/*The purchase for a profile theme, as seen on the Store page. 
Takes in a prop "theme" which is the profile theme to be displayed within this component, 
and "openModal" which is the function to open the modal which triggers on a press of the button.*/
function ProfileThemes({ theme, openModal }) {

    const {user} = useAuth();
    const [isPurchased, setIsPurchased] = useState(false);  

    //Sets whether or not the user has already purchased this theme.
    useEffect(() => {
        if(!user) return;
        // If the user has the background, set isPurchased to true
        if(!user.Inventory.Banners || user.Inventory.Banners.length === 0) return;
        if(user.Inventory.Banners.filter(bg => bg.name === theme.name).length > 0){
            setIsPurchased(true);
        }else{
            setIsPurchased(false);
        }
    },[user])

    /*----Actual theme purchaser layout starts here----*/
    return (
        <div className='decoHolder'> 
            <div key={theme.name}>
                <img className="bg" src={theme.img} alt={theme.name} />
                <p>{theme.name}</p>
                {isPurchased? 
                <>
                    <button className='itemCost purchased' onClick={() => openModal(theme)} disabled>Purchased</button>  
                </>: 
                <>
                    <button className='itemCost unpurchased' onClick={() => openModal(theme)}>Cost: {theme.cost}</button>
                </>}
            </div>
        </div>
    );
}

export default ProfileThemes;