import React, {useEffect, useState} from 'react';
import '../../../StorePage/Store.css'
import { useSelector } from 'react-redux';
import { useAuth } from '../../../../../Context/AuthContext';
import { setSelectedDeco } from '../../../../../Firebase/FirebaseUtils';
import { auth } from '../../../../../Firebase/Firebase';

/*The setter panel for a profile decoration, as seen on the Profile page. Takes in a prop "decorations" which is the profile decoration to be displayed within this component.*/
function ProfileDecoSet({ decorations }) {
    const {user} = useAuth();
    const [isPurchased, setIsPurchased] = useState(false);  

    //Gets the user's currently selected profile decoration.
    useEffect(() => {
        if(!user) return;
        if(!user.Inventory.Icons || user.Inventory.Icons.length === 0) return;
        if(decorations.isSelected == true){
            setIsPurchased(true);
        }else{
            setIsPurchased(false);
        }
    },[user])

    //Set the user's selected decoration to the one corresponding with this component.
    const decoSetter = async () => {
        await setSelectedDeco(decorations.name, auth.currentUser.uid)
        window.location.reload();
    }

    /*----Actual decoration setter layout starts here----*/
    return (
        <div className='decoHolder'>
            <div className="profileImgHolder">
                <img className="icon" src={decorations.img} alt={decorations.name} />
                <img className="rounded dummyProfile" src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg" alt="Profile" />
            </div>
            <p>{decorations.name}</p>
            {isPurchased? 
            <>
                <button className='itemCost purchased' onClick={decoSetter} disabled>Selected</button>  
            </>: 
            <>
                <button className='itemCost unpurchased' onClick={decoSetter}>Select</button>
            </>}
            
        </div>
    );
}

export default ProfileDecoSet;