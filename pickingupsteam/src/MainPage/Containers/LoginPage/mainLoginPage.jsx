import React, {useState} from 'react'
import './MainLoginPage.css'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../../Firebase/Firebase'

const MainLoginPage = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [steamID, setSteamID] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
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
        <input type="email" class="form-control" name="email" required></input>
        <label for="email">Email address</label>
      </div>
      <div>
        <input type="password" class="form-control" name="password" required></input>
        <label for="password">Password</label>
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
        <label for="email">Email address</label>
      </div>
      <div>
        <input type="text"        
        placeholder='Enter SteamID'
        value={steamID}
        onChange={(e) => setSteamID(e.target.value)}
        name="steamid" required></input>
        <label for="steamid">Steam ID</label>
      </div>
      <div>
        <input type="password" 
        placeholder='Enter Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        name="password" required></input>
        <label for="password">Password</label>
      </div>
      <button type="submit">Submit</button>
    </form>
  </div>
</div>
  )
}

export default MainLoginPage