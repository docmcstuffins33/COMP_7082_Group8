import React, {useState} from 'react'
import './MainLoginPage.css'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth} from '../../../Firebase/Firebase'
import { writeUser } from '../../../Firebase/FirebaseUtils'

const MainLoginPage = () => {

  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [steamID, setSteamID] = useState("");
  const [username, setUsername] = useState("");

  const [logEmail, setLogEmail] = useState("");
  const [logPassword, setLogPassword] = useState("");

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
        await writeUser(user.uid, userData);
      }
      console.log(user);
    } catch (error) {
      console.log(error);
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, logEmail, logPassword)
      const user = auth.currentUser
      console.log(user)
    } catch (error) {
      console.log(error)
    }
  }

  return (
<div>
  <div>
    <form onSubmit={handleLogin}>
      <h1>Log In</h1>
      <div>
        <input type="email"         
        placeholder='Enter Email'
        value={logEmail}
        onChange={(e) => setLogEmail(e.target.value)} 
        name="email" required></input>
      </div>
      <div>
        <input type="password"         
        placeholder='Enter Password'
        value={logPassword}
        onChange={(e) => setLogPassword(e.target.value)}
        name="password" required></input>
      </div>
      <button type="submit">Submit</button>
    </form>
  </div>

  <div>
    <form onSubmit={handleRegister}>
      <h1>Sign Up</h1>
      <div>
        <input type="email"             
        placeholder='Enter Email'
        value={regEmail}
        onChange={(e) => setRegEmail(e.target.value)}
        name="email" required></input>
      </div>
      <div>
        <input type="text"             
        placeholder='Enter Username'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        name="username" required></input>
      </div>
      <div>
        <input type="text"        
        placeholder='Enter SteamID'
        value={steamID}
        onChange={(e) => setSteamID(e.target.value)}
        name="steamid" required></input>
      </div>
      <div>
        <input type="password" 
        placeholder='Enter Password'
        value={regPassword}
        onChange={(e) => setRegPassword(e.target.value)}
        name="password" required></input>
      </div>
      <button type="submit">Submit</button>
    </form>
  </div>
</div>
  )
}

export default MainLoginPage