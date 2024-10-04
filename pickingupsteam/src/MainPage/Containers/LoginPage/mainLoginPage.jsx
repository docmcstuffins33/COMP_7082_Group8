import React, {useState} from 'react'
import './MainLoginPage.css'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../../../Firebase/Firebase'
import { fetchUser, writeUser } from '../../../Firebase/FirebaseUtils'

const MainLoginPage = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [steamID, setSteamID] = useState("");
  const [username, setUsername] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if(user) {
        const userData = {
          Username: username,
          Email: email,
          Points: 0,
          SteamID: steamID,
          Games: [],
          Inventory: {
            Banners: [],
            Icons: []
          }
        }
        console.log(userData);
        await writeUser(user.uid, userData);
      }
      console.log(user);
    } catch (error) {
      console.log(error);
    }
  }

  return (
<div>
  <div>
    <form>
      <h1>Log In</h1>
      <div>
        <input type="email" name="email" required></input>
      </div>
      <div>
        <input type="password"name="password" required></input>
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
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        name="password" required></input>
      </div>
      <button type="submit">Submit</button>
    </form>
  </div>
</div>
  )
}

export default MainLoginPage