import React, { useState, useEffect } from 'react'
import { GetGameByUserID } from '../../../SteamUtils/index.js'
import './MainRandomGamePage.css'
import { useSelector} from 'react-redux';
import { useAuth } from '../../../Context/AuthContext';
import { auth} from '../../../Firebase/Firebase'
import { useFirebaseHook } from '../../../Firebase/FireBaseHook'
import { getSelectedDeco } from '../../../Firebase/FirebaseUtils.js';
import ProfilePic from '../ProfilePage/Components/ProfilePicture/ProfilePic.js';
const MainRandomGamePage = () => {

    //can be deleted once profile picture component is finished
    const [decoImg, setDecoImg] = useState(null);

    //page states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // User Data
    const { user, isAuthenticated, updateUser } = useAuth();
    const { addSelectedGame, removeSelectedGame} = useFirebaseHook();

    //Steam ID
    const [steamID, setSteamID] = useState("");
    const [gameData, setGameData] = useState([]);

    // Server Data
    const [serverURL, setServerURL] = useState(process.env.REACT_APP_SERVER_URL);
    const [serverPort, setServerPort] = useState(process.env.REACT_APP_SERVER_PORT);

    // Random Game wheel Data
    const [randomGame, setRandomGame] = useState(null);
    const [selectedGame, setSelectedGame] = useState(null);

    useEffect(() => {
        if (user) {
            fetchGameData(user.SteamID);
            fetchDeco();
        }
    }, [user]);

    const fetchDeco = async () => {
        const banner = await getSelectedDeco(auth.currentUser.uid)
        console.log(banner)
        if(banner != null){
            setDecoImg(banner.img);
        }
    };

    const fetchGameData = async (id = steamID) => {
        setLoading(true);
        try {
            const gameData = await GetGameByUserID(id, serverURL, serverPort);
            setGameData(gameData);
            if(user && user.SelectedGame) {
                console.log(user.SelectedGame)
                console.log(gameData.find((game) => game.appid == user.SelectedGame))
                setSelectedGame(gameData.find((game) => game.appid == user.SelectedGame))
            }
            
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
        let incompleteGameData = gameData.filter(game => game.playtime_forever < 120);
        const randomIndex = Math.floor(Math.random() * incompleteGameData.length);
        setRandomGame(incompleteGameData[randomIndex]);
        console.log(incompleteGameData[randomIndex]);
    }

    const selectGame = async () => {
        if(isAuthenticated) {
            const authUser = auth.currentUser;
            await addSelectedGame(authUser.uid, user, randomGame.appid);
            setRandomGame(null);
        }
    }

    const claimGame = async() => {
        if(isAuthenticated) {
            const authUser = auth.currentUser;
            await removeSelectedGame(authUser.uid, user);
            setRandomGame(null);
            setSelectedGame(null);
        }
    }

    const segments = [];
    const [spinning, setSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);

    const spinWheel = () => {
        if (spinning) return; // Prevent multiple spins
        const spinTo = Math.floor(Math.random() * 360 + 720); // Minimum 2 full spins
        setRotation((prev) => prev + spinTo);
        setSpinning(true);
        setTimeout(() => {
        setSpinning(false);
        const winningSegment = segments[Math.floor(((rotation + spinTo) % 360) / (360 / segments.length))];
        alert(`You won: ${winningSegment}`);
        }, 3000); // Match animation duration
    };
    
      

    return (
    <div class="app__main_container">
        <div class="app__searchBar">
            {user && user.Inventory &&user.Inventory.Icons ? 
            <div className ="app_user-profile-container">
                <ProfilePic className="app__user-profile-iconTheme"></ProfilePic>
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
                    (gameData.filter(game => game.playtime_forever < 120).map(game => (<div className="app__gameList-item">{
                        <p className="app__gameList-item-text">{game.name}</p>
                        }</div>))))}
                    {gameData.filter(game => game.playtime_forever < 120).map(game => (segments.push(game.name)))}
                </div>

            </div>
            <div className="app__randomGameWheel">
                <h2>
                    Random Game
                </h2>

                <div className="wheel-container">
                <div
                    className={`wheel ${spinning ? 'spinning' : ''}`}
                    style={{ transform: `rotate(${rotation}deg)` }}
                >
                    {segments.map((segment, index) => (
                    <div
                        key={index}
                        className="segment"
                        style={{
                        transform: `rotate(${(360 / segments.length) * index}deg)`,
                        backgroundColor: index % 2 === 0 ? '#F7A' : '#AAF',
                        clipPath: `polygon(0% 0%, 100% 0%, 100% 10%, 0% 0%)`,
                        overflow: `hidden`,
                        }}
                    >
                        {segment}
                    </div>
                    ))}
                </div>
                <button onClick={spinWheel} disabled={spinning} className="spin-button">
                    Spin
                </button>
                </div>
                
                {isAuthenticated ? (selectedGame ? <></> : 
                <button className="app__randomGameWheel-button" onClick={pickRandomGame}>Pick Random Game</button>) 
                : <button className="app__randomGameWheel-button" onClick={pickRandomGame}>Pick Random Game</button>}

                    {isAuthenticated && selectedGame ? 
                    <div className="app__randomGameItem">
                    <img src={"http://media.steampowered.com/steamcommunity/public/images/apps/" + 
                    selectedGame.appid + "/" + selectedGame.img_icon_url + ".jpg"}></img> 
                    <p>{selectedGame.name} </p>
                    <p>Playtime Progress: {selectedGame.playtime_forever} / 120 minutes</p>
                    {selectedGame.playtime_forever > 120 ? <button className="app__selectGame-button" onClick={claimGame}>+200 Credits</button> 
                    : <button className="app__selectGame-button" onClick={claimGame} disabled>+200 Credits</button>}
                    </div>

                    : (randomGame != null ? <div className="app__randomGameItem">
                        <img src={"http://media.steampowered.com/steamcommunity/public/images/apps/" + 
                        randomGame.appid + "/" + randomGame.img_icon_url + ".jpg"}></img> 
                        <p>{randomGame.name} </p>
                        <p>Playtime: {randomGame.playtime_forever} Minutes</p>
                        {isAuthenticated ? <button className="app__selectGame-button" onClick={selectGame}>Select Game</button> : <></>}
                        </div>: <></>)}
            </div>
            
        </div>
    </div>
  )
}

export default MainRandomGamePage

