import React, { useEffect } from 'react'
import { useState } from 'react'
import "./MainProfilePage.css"

import ProfilePic from '../../Components/ProfilePicture/ProfilePic'

import { useSelector } from 'react-redux'
import { Navigate, useNavigate} from 'react-router-dom'
import { useAuth } from '../../../Context/AuthContext';
const MainProfilePage = () => {

    const {user, isAuthenticated} = useAuth();
    const [returnTimer, setReturnTimer] = useState(5);
    const navigate = useNavigate();


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

    

    return (
        <div>
            {isAuthenticated ? <>
                <h1>Username: {user.Username}</h1>
                <h1>Email: {user.Email}</h1>
                <h1>SteamID: {user.SteamID}</h1>
                <ProfilePic isEditable="false"></ProfilePic>
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