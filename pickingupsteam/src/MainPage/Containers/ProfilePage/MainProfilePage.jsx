import React, { useEffect } from 'react'
import { useState } from 'react'
import "./MainProfilePage.css"

import { useSelector } from 'react-redux'
import { Navigate, useNavigate} from 'react-router-dom'
const MainProfilePage = () => {

    const {user, isAuthenticated} = useSelector(state => state.auth);
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