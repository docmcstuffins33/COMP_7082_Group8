import React, {useEffect, useState} from 'react';
import '../Store.css';
import { useSelector } from 'react-redux';
function ProfileThemes({ theme, openModal }) {

    const {user} = useSelector(state => state.auth);
    const [isPurchased, setIsPurchased] = useState(false);  
    useEffect(() => {
        if(!user) return;
        // console.log(user.Inventory)
        // console.log(decorations.name)
        // console.log(user.Inventory.filter(icon => icon.name === decorations.name));
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