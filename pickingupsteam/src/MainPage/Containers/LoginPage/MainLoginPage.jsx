import React, {useState} from 'react'
import './MainLoginPage.css'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth} from '../../../Firebase/Firebase'

import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Textfield from '@mui/material/TextField';

import { useFirebaseHook } from '../../../Firebase/FireBaseHook'
import { fetchUser } from '../../../Firebase/FirebaseUtils'

import axios from 'axios';

/** 
 * Page for login and signup forms
 * 
 */

const MainLoginPage = () => {

    //States for values in the Signup form (Creating a new account)
    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [steamID, setSteamID] = useState("");
    const [username, setUsername] = useState("");

    //State for values in the Login form
    const [logEmail, setLogEmail] = useState("");
    const [logPassword, setLogPassword] = useState("");

    //Get serverURL and port for API calls
    const [serverURL] = useState(process.env.REACT_APP_SERVER_URL);
    const [serverPort] = useState(process.env.REACT_APP_SERVER_PORT);

    const navigate = useNavigate()

    const [error, setError] = useState(null);

    //Get Firebase hooks
    const { writeUserToDB, startLogin, SignOutUser} = useFirebaseHook();

    //Handling registering a new account
    const handleRegister = async (e) => {
        e.preventDefault()
        try {
            //Check if profile is private, inform user if it is
            const visibility = await axios.get(`http://${serverURL}:${serverPort}/api/getProfileVisibility/${steamID}`);
            if (visibility.data.profileState !== 3) {
                alert("Signup Failed - Steam id is not public or is invalid");
                return;
            }

            //Create a new account with given email and password
            await createUserWithEmailAndPassword(auth, regEmail, regPassword);
            const user = auth.currentUser;
            if(user) {
                //Set user data in Firestore
                const userData = {
                    Username: username,
                    Email: regEmail,
                    Points: 0,
                    SteamID: steamID,
                    Games: [],
                    Inventory: {
                        Banners: [],
                        Icons: []
                    },
                    SelectedGame: null,
                    Achievements: null
                }
                await writeUserToDB(user.uid, userData).then(() => {
                    //console.log("Collection updated/added:", user.uid);
                    //store user in redux
                    navigate('/profile');
                });
            }
            // console.log(user);
        } 
        catch (error) {
            //console.log(error);
            if(error.message.includes("auth/invalid-email"))
                alert("Signup Failed - Invalid Email format")
            else if(error.message.includes("auth/missing"))
                alert("Signup Failed - Make sure you've filled in every field!")
            else if(error.message.includes("auth/weak-password"))
                alert("Signup Failed - Your password must be at least 6 characters.")
            else
                alert("Signup Failed - Please try again.")
        }
    }

//Handle logging into an existing account
  const handleLogin = async (e) => {
    e.preventDefault()
    try {
        //Login with given email and password
        await signInWithEmailAndPassword(auth, logEmail, logPassword)
        const user = auth.currentUser
        //console.log(user.uid);

        const userData = await fetchUser(user.uid);
        //Check if Steam account is private
        const visibility = await axios.get(`http://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/api/getProfileVisibility/${userData.SteamID}`);
        if (visibility.data.profileState !== 3) {
            alert("Login Failed - Steam id is not public or has become invalid");

            await handlesignOut();
            return;
        }
        //Login user, then go to previous page
        await startLogin(user.uid).then((state)=>{
            if(state){
                //redirect to previous page
                const previousPage = sessionStorage.getItem("previousPage") || '/profile';
                navigate(previousPage);
                sessionStorage.removeItem("previousPage"); // Clear after redirection
            }
        })

    } catch (error) {
        //console.log(error)
        if(error.message.includes("auth/invalid-credential"))
            alert("Login Failed - Invalid Credentials")
        else if(error.message.includes("auth/invalid-email"))
            alert("Login Failed - Invalid Email format")
        else if(error.message.includes("auth/missing"))
            alert("Login Failed - Make sure you've filled in every field!")
        else
            alert("Login Failed - Please try again.")
    }
  }

  //Handle signout from account
    const handlesignOut = async (e) => {
        try {
            await SignOutUser();
            //console.log("User logged out")
        } catch (error) {
            //console.log(error)
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
                <button className="login__link-button" type="submit">Log In</button>
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
                <button className="login__link-button" type="submit">Sign Up</button>
            </Box>
        </div>
    </div>
    )
}

export default MainLoginPage
