import React, {useEffect, useState} from 'react';
import '../Store.css';
import { useSelector } from 'react-redux';
import { useAuth } from '../../../../Context/AuthContext';

/*The purchase for a profile decoration, as seen on the Store page. 
Takes in a prop "decorations" which is the profile decoration to be displayed within this component, 
and "openModal" which is the function to open the modal which triggers on a press of the button.*/
function ProfileDecorations({ decorations, openModal }) {
    const {user} = useAuth();
    const [isPurchased, setIsPurchased] = useState(false);  

    //Sets whether or not the user has already purchased this decoration.
    useEffect(() => {
        if(!user) return;
        // If the user has the icon, set isPurchased to true
        if(!user.Inventory.Icons || user.Inventory.Icons.length === 0) return;
        if(user.Inventory.Icons.filter(icon => icon.name === decorations.name).length > 0){
            setIsPurchased(true);
        }else{
            setIsPurchased(false);
        }
    },[user])

    /*----Actual decoration purchaser layout starts here----*/
    return (
        <div className='decoHolder'>
            <div className="profileImgHolder">
                <img className="icon" src={decorations.img} alt={decorations.name} />
                <img className="rounded dummyProfile" src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg" alt="Profile" />
            </div>
            <p>{decorations.name}</p>
            {isPurchased? 
            <>
                <button className='itemCost purchased' onClick={() => openModal(decorations)} disabled>Purchased</button>  
            </>: 
            <>
                <button className='itemCost unpurchased' onClick={() => openModal(decorations)}>Cost: {decorations.cost}</button>
            </>}
            
        </div>
    );
}

export default ProfileDecorations;