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
    <div class="app__mainPanel">
        <div class="app__login-form">
            <Box component="form"
                sx={{ '& .MuiTextField-root': { m: 1, width: '1ch' } }}
                noValidate
                autoComplete="on"
                style={{display: 'flex', flexDirection: 'column', width: '50%'}}
                onSubmit={handleLogin}
                >
                    <h1>Log In</h1>
                    <Textfield
                        required
                        id="outlined-required"
                        label="Email"
                        variant="filled"
                        style={{width: '25ch', backgroundColor: 'white', width: '100%'}}
                        onChange={(e) => setLogEmail(e.target.value)}
                    ></Textfield>
                    <Textfield
                        required
                        id="outlined-required"
                        label="Password"
                        variant="filled"
                        style={{width: '25ch', backgroundColor: 'white', width: '100%'}}
                        onChange={(e) => setLogPassword(e.target.value)}
                    ></Textfield>
                    <button class="login__link-button" type="submit">Submit</button>
            </Box>

            {/* <form onSubmit={handleLogin}>
            <h1>Log In</h1>
            <div>
                <input type="email"         
                placeholder='Enter Email'
                value={logEmail}
                onChange={(e) => setLogEmail(e.target.value)} 
                name="email" required
                class="login_inputField"></input>
            </div>
            <div>
                <input type="password"         
                placeholder='Enter Password'
                value={logPassword}
                onChange={(e) => setLogPassword(e.target.value)}
                name="password" required
                class="login_inputField"></input>
            </div>
            <button class="login__link-button" type="submit">Submit</button>
            </form> */}
        </div>

        <div class="app__register-form">
            <form onSubmit={handleRegister}>
            <h1>Sign Up</h1>
            <div>
                <input type="email"             
                placeholder='Enter Email'
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                name="email" required
                class="login_inputField"></input>
            </div>
            <div>
                <input type="text"             
                placeholder='Enter Username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                name="username" required
                class="login_inputField"></input>
            </div>
            <div>
                <input type="text"        
                placeholder='Enter SteamID'
                value={steamID}
                onChange={(e) => setSteamID(e.target.value)}
                name="steamid" required 
                class="login_inputField"></input>
            </div>
            <div>
                <input type="password" 
                placeholder='Enter Password'
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                name="password" required
                class="login_inputField"></input>
            </div>
            <button class="login__link-button" type="submit">Submit</button>
            </form>
        </div>

        {/* <button onClick={handlesignOut}>Log Out</button> */}
    </div>
  )
}

export default MainLoginPage