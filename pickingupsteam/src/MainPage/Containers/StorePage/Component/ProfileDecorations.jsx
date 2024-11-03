import React, {useEffect, useState} from 'react';
import '../Store.css';
import { useSelector } from 'react-redux';
function ProfileDecorations({ decorations, openModal }) {
    const {user} = useSelector(state => state.auth);
    const [isPurchased, setIsPurchased] = useState(false);  

    useEffect(() => {
        if(!user) return;

        // console.log(user.Inventory.Icons.filter(icon => icon.name === decorations.name));

        // If the user has the icon, set isPurchased to true
        console.log(user.Inventory.Icons)
        if(!user.Inventory.Icons || user.Inventory.Icons.length === 0) return;
        console.log(user)
        if(user.Inventory.Icons.filter(icon => icon.name === decorations.name).length > 0){
            setIsPurchased(true);
        }else{
            setIsPurchased(false);
        }
    },[user])

    return (
        <div>
            <div className="profileImgHolder">
                <img className="icon" src={decorations.img} alt={decorations.name} />
                <img className="rounded dummyProfile" src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg" alt="Profile" />
            </div>
            <p>{decorations.name}</p>
            {isPurchased? 
            <>
                <button className='itemCost' onClick={() => openModal(decorations)} disabled>Purchased</button>  
            </>: 
            <>
                <button className='itemCost' onClick={() => openModal(decorations)}>Cost: {decorations.cost}</button>
            </>}
            
        </div>
    );
}

export default ProfileDecorations;