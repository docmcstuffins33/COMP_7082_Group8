import React, {useEffect, useState} from 'react';
import '../../../StorePage/Store.css'
import { useSelector } from 'react-redux';
import { useAuth } from '../../../../../Context/AuthContext';
import { setSelectedDeco } from '../../../../../Firebase/FirebaseUtils';
import { auth } from '../../../../../Firebase/Firebase';
function ProfileDecoSet({ decorations, select }) {
    const {user} = useAuth();
    const [isPurchased, setIsPurchased] = useState(false);  

    useEffect(() => {
        if(!user) return;

        // console.log(user.Inventory.Icons.filter(icon => icon.name === decorations.name));

        // If the user has the icon, set isPurchased to true
        console.log(user.Inventory.Icons)
        if(!user.Inventory.Icons || user.Inventory.Icons.length === 0) return;
        console.log(user)
        if(decorations.isSelected == true){
            setIsPurchased(true);
        }else{
            setIsPurchased(false);
        }
    },[user])

    const decoSetter = async () => {
        await setSelectedDeco(decorations.name, auth.currentUser.uid)
        window.location.reload();
    }

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