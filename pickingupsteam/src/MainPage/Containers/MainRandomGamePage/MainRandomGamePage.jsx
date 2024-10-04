import React, { useState, useEffect } from 'react'
import { GetGameByUserID } from '../../../SteamUtils/index.js'
import './MainRandomGamePage.css'

const MainRandomGamePage = () => {

    //page states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // User Data
    //should be load dynamically
    const [userID, setUserID] = useState("");
    const [gameData, setGameData] = useState([]);

    // Server Data
    const [serverURL, setServerURL] = useState(process.env.REACT_APP_SERVER_URL);
    const [serverPort, setServerPort] = useState(process.env.REACT_APP_SERVER_PORT);

    // Random Game wheel Data
    const [randomGame, setRandomGame] = useState(null);

    //initial fetch
    useEffect(() => {
        fetchGameData();
    },[])


    const fetchGameData = async () => {
        try{
            let gameData = await GetGameByUserID(userID, serverURL, serverPort);
            setGameData(gameData);
        }catch(err){
            setError(err);
            console.error(err);
        }finally{
            setLoading(false);
        }
        
        console.log(gameData)
    }

    const handleSearch = async () => {
        fetchGameData()
    }

    const pickRandomGame = () => {
        if (gameData.length === 0) {
            return;
        }
        const randomIndex = Math.floor(Math.random() * gameData.length);
        setRandomGame(gameData[randomIndex].name);
    }

    return (
    <div class="app__main_container">
        <div class="app__searchBar">
            <div>
            <input class="app__searchBar-input"
            type="text"
            placeholder='Enter Steam User ID'
            value={userID}
            onChange={(e) => setUserID(e.target.value)}
            />
            <button onClick={handleSearch} class='app__searchBar-button' >
                Search
             </button> </div>
        </div>
        <div class="app__gameListPanel">
            <div class="app__gameList">
                <h2>Game List </h2>
                <div class="app__gameList-container">
                    
                    {loading ? (<div>Loading...</div>) :
                    (error ? (<div>Error</div>) :
                    (gameData.map(game => (<div class="app__gameList-item">{
                        <p class="app__gameList-item-text">{game.name}</p>
                        }</div>))))}
                </div>

            </div>
            <div class="app__randomGameWheel">
                <h2>
                    Random Game
                </h2>
                <button class="app__randomGameWheel-button" onClick={pickRandomGame}>Pick Random Game</button>
                <p>
                    {randomGame}
                </p>
            </div>
            
        </div>
    </div>
  )
}

export default MainRandomGamePage

