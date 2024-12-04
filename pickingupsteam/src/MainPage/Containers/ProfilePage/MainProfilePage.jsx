import React, { useEffect } from 'react'
import { useState } from 'react'
import "./MainProfilePage.css"
import ProfilePic from './Components/ProfilePicture/ProfilePic'
import ProfileDecoSet from './Components/ProfilePicture/ProfileDecoSet'
import ProfileThemeSet from './Components/ProfilePicture/ProfileThemeSet'
import { useSelector } from 'react-redux'
import { Navigate, useNavigate} from 'react-router-dom'
import { useAuth } from '../../../Context/AuthContext';
import { getSelectedDeco} from '../../../Firebase/FirebaseUtils'


const MainProfilePage = () => {

    //Set auths for user and user decorations
    const {user, isAuthenticated} = useAuth();
    const [returnTimer, setReturnTimer] = useState(5);
    const navigate = useNavigate();
    const [profileDecorations, setProfileDecorations] = useState([]);
    const [profileThemes, setProfileThemes] = useState([]);
    
    // return back to home after 5 seconds
    useEffect(() => {
        if(!isAuthenticated) {
            const timer = setInterval(() => {
                setReturnTimer(time =>{
                    if(time === 0) {
                        clearInterval(timer)
                        navigate('/home')
                        return 0
                    }
                    return time - 1
                })
            }, 1000)
            return () => clearInterval(timer)
        }
    }, [isAuthenticated])

    //Update inventorys when user state is updated
    useEffect(() => {
        if(!user) return;
        if(user.Inventory.Icons && !user.Inventory.Icons.length === 0)
            //console.log(user.Inventory.Icons);
            setProfileDecorations(user.Inventory.Icons);
        if(user.Inventory.Banners && !user.Inventory.Banners.length === 0)
            //console.log(user.Inventory.Banners);
            setProfileThemes(user.Inventory.Banners);
    },[user])

    const selectDecoration = () => {
        alert("hello");
    }
    

    return (
        <div className='profilePageHolder'>
            {isAuthenticated ? <>
                <h1 className='profileName'>{user.Username}</h1>
                <h3>{user.Email}</h3>
                <h3>SteamID: {user.SteamID}</h3>
                <ProfilePic editable="true"></ProfilePic>
                
                {profileDecorations?.length > 0 &&
                    <>
                        <h1 className='sectionHead'>Profile Decorations</h1>
                        <div id='profileDecorations'>
                            {profileDecorations.map(dec => (
                                <ProfileDecoSet key={dec.name} decorations={dec}/>
                            ))}
                        </div>
                    </>
                }
                {profileThemes?.length > 0 &&
                    <>
                        <h1 className='sectionHead'>Themes</h1>
                        <div id='profileThemes'>
                        {profileThemes.map(theme => (
                            <ProfileThemeSet key={theme.name} theme={theme}/>
                        ))}
                        </div>
                    </>
                }  
                </>
                : 
                <>
                    <h1>You are not logged in</h1>
                    <div>returning to menu in {returnTimer}</div>
                </>
        }
        </div>
        
    )
}

export default MainProfilePage