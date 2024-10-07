import React, {useState} from 'react'
import './MainLoginPage.css'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth} from '../../../Firebase/Firebase'

import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Textfield from '@mui/material/TextField';

import { useFirebaseHook } from '../../../Firebase/FireBaseHook'

const MainLoginPage = () => {
    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [steamID, setSteamID] = useState("");
    const [username, setUsername] = useState("");

    const [logEmail, setLogEmail] = useState("");
    const [logPassword, setLogPassword] = useState("");

    const navigate = useNavigate()

    const [error, setError] = useState(null);

    const { writeUserToDB, startLogin, signOutUser} = useFirebaseHook();

    const handleRegister = async (e) => {
        e.preventDefault()
        try {
            await createUserWithEmailAndPassword(auth, regEmail, regPassword);
            const user = auth.currentUser;
            if(user) {
                const userData = {
                    Username: username,
                    Email: regEmail,
                    Points: 0,
                    SteamID: steamID,
                    Games: [],
                    Inventory: {
                        Banners: [],
                        Icons: []
                    }
                }
                await writeUserToDB(user.uid, userData).then(() => {
                    console.log("Collection updated/added:", user.uid);
                    //store user in redux
                    navigate('/profile');
                });
            }
            console.log(user);
        } 
        catch (error) {
            console.log(error);
        }
    }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
        await signInWithEmailAndPassword(auth, logEmail, logPassword)
        const user = auth.currentUser
        console.log(user.uid)
        await startLogin(user.uid).then((state)=>{
            if(state){
                navigate('/profile')
            }
        })

    } catch (error) {
        console.log(error)
    }
  }

    const handlesignOut = async (e) => {
        try {
            await signOutUser();
            console.log("User logged out")
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div className="app__mainPanel">
        <div className="app__login-form">
            <Box component="form"
                sx={{ '& .MuiTextField-root': { m: 1, width: '1ch' } }}
                noValidate
                autoComplete="on"
                style={{ display: 'flex', flexDirection: 'column', width: '50%' }}
                onSubmit={handleLogin}
            >
                <h1>Log In</h1>
                <Textfield
                    required
                    id="log-email"
                    label="Email"
                    type="email"
                    variant="filled"
                    input="email"
                    style={{ width: '100%', backgroundColor: 'white' }}
                    onChange={(e) => setLogEmail(e.target.value)}
                />
                <Textfield
                    required
                    id="log-password"
                    label="Password"
                    type="password"
                    variant="filled"
                    style={{ width: '100%', backgroundColor: 'white' }}
                    onChange={(e) => setLogPassword(e.target.value)}
                />
                <button className="login__link-button" type="submit">Submit</button>
            </Box>
        </div>

        <div className="app__register-form">
            <Box component="form"
                sx={{ '& .MuiTextField-root': { m: 1, width: '1ch' } }}
                noValidate
                autoComplete="on"
                style={{ display: 'flex', flexDirection: 'column', width: '50%' }}
                onSubmit={handleRegister}
            >
                <h1>Sign Up</h1>
                <Textfield
                    required
                    id="reg-email"
                    label="Email"
                    type="email"
                    variant="filled"
                    style={{ width: '100%', backgroundColor: 'white' }}
                    onChange={(e) => setRegEmail(e.target.value)}
                />
                <Textfield
                    required
                    id="reg-username"
                    label="Username"
                    type="text"
                    variant="filled"
                    style={{ width: '100%', backgroundColor: 'white' }}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <Textfield
                    required
                    id="reg-steamid"
                    label="SteamID"
                    type="text"
                    variant="filled"
                    style={{ width: '100%', backgroundColor: 'white' }}
                    onChange={(e) => setSteamID(e.target.value)}
                />
                <Textfield
                    required
                    id="reg-password"
                    label="Password"
                    type="password"
                    variant="filled"
                    style={{ width: '100%', backgroundColor: 'white' }}
                    onChange={(e) => setRegPassword(e.target.value)}
                />
                <button className="login__link-button" type="submit">Submit</button>
            </Box>
        </div>
    </div>
    )
}

export default MainLoginPage