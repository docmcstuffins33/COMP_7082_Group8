import React, { useState, useEffect } from 'react'
import { GetGameByUserID } from '../../../SteamUtils/index.js'
import './MainRandomGamePage.css'
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../../../Context/AuthContext';

const MainRandomGamePage = () => {

    //page states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // User Data
    const { user } = useAuth();
    const dispatch = useDispatch();

    //Steam ID
    const [steamID, setSteamID] = useState("");
    const [gameData, setGameData] = useState([]);

    // Server Data
    const [serverURL, setServerURL] = useState(process.env.REACT_APP_SERVER_URL);
    const [serverPort, setServerPort] = useState(process.env.REACT_APP_SERVER_PORT);

    // Random Game wheel Data
    const [randomGame, setRandomGame] = useState(null);

    useEffect(() => {
        if (user) {
            fetchGameData(user.SteamID);
        }
    }, [user]);

    const fetchGameData = async (id = steamID) => {
        setLoading(true);
        try {
            const gameData = await GetGameByUserID(id, serverURL, serverPort);
            setGameData(gameData);
            //let completeTime = 30;
            //if (gameData.length > 0) {
            //    incompleteGameData = await gameData.filter(game => game.playtime_forever < completeTime);
             //   setIncompleteGameData(incompleteGameData);
            //}
        } catch (err) {
            setError(err);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleSearch = async () => {
        fetchGameData();
    }

    const pickRandomGame = () => {
        if (gameData.length === 0) {
            return;
        }
        let incompleteGameData = gameData.filter(game => game.playtime_forever < 30);
        const randomIndex = Math.floor(Math.random() * incompleteGameData.length);
        setRandomGame(incompleteGameData[randomIndex].name);
    }

    return (
    <div class="app__main_container">
        <div class="app__searchBar">
            {user && user.Inventory &&user.Inventory.Icons ? 
            <div class ="app_user-profile-container">
                <img src={user.Inventory.Icons[0]?.img} alt={`${user.Username}'s icon`} className="app__user-profile-iconTheme" />
                <h1 class="app__user-profile-text">Welcome, {user.Username}!</h1>
            </div>
            :
            <>
                <input class="app__searchBar-input"
                type="text"
                placeholder='Enter Steam User ID'
                value={steamID}
                onChange={(e) => setSteamID(e.target.value)}
                />
                <button onClick={handleSearch} className='app__searchBar-button' >
                    Search
                </button>
            </>     
            }

        </div>
        <div className="app__gameListPanel">
            <div className="app__gameList">
                <h2>Game List </h2>
                <div className="app__gameList-container">
                    {loading ? (<div>Loading...</div>) :
                    (error ? (<div>Error</div>) :
                    (gameData.filter(game => game.playtime_forever < 30).map(game => (<div className="app__gameList-item">{
                        <p className="app__gameList-item-text">{game.name}</p>
                        }</div>))))}
                </div>

            </div>
            <div className="app__randomGameWheel">
                <h2>
                    Random Game
                </h2>
                <button className="app__randomGameWheel-button" onClick={pickRandomGame}>Pick Random Game</button>
                <p>
                    {randomGame}
                </p>
            </div>
            
        </div>
    </div>
  )
}

export default MainRandomGamePage

