import React, {useEffect, useState} from 'react';
import '../Store.css';
import { useSelector } from 'react-redux';
import { useAuth } from '../../../../Context/AuthContext';
function ProfileThemes({ theme, openModal }) {

    const {user} = useAuth();
    const [isPurchased, setIsPurchased] = useState(false);  
    useEffect(() => {
        if(!user) return;

        // console.log(user.Inventory.Banners.filter(icon => icon.name === decorations.name));

        // If the user has the background, set isPurchased to true
        if(!user.Inventory.Banners || user.Inventory.Banners.length === 0) return;
        console.log(user)
        if(user.Inventory.Banners.filter(bg => bg.name === theme.name).length > 0){
            setIsPurchased(true);
        }else{
            setIsPurchased(false);
        }
    },[user])
    return (
        <div>
            <div key={theme.name}>
                <img className="bg" src={theme.img} alt={theme.name} />
                <p>{theme.name}</p>
                {isPurchased? 
                <>
                    <button className='itemCost' onClick={() => openModal(theme)} disabled>Purchased</button>  
                </>: 
                <>
                    <button className='itemCost' onClick={() => openModal(theme)}>Cost: {theme.cost}</button>
                </>}
            </div>
        </div>
    );
}

export default ProfileThemes;