import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {  } from 'react-redux'


import { useFirebaseHook } from '../../../Firebase/FireBaseHook'

const SignoutPage = () => {
    const [returnTimer, setReturnTimer] = useState(5);
    const navigate = useNavigate();
    const {SignOutUser} = useFirebaseHook();

    useEffect(() => {
        const StartsignOut = async () => {
            await SignOutUser();
        }
        StartsignOut()
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
    }, [])

    return (
        <div>
            <h1>You have been Signed Out</h1>
            <div>returning to menu in {returnTimer}</div>
        </div>
        
    )
}

export default SignoutPage