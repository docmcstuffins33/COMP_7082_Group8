import React, { useState, useEffect } from 'react'
import { GetGameByUserID } from '../../../SteamUtils/index.js'
import './MainRandomGamePage.css'
import { useSelector} from 'react-redux';
import { useAuth } from '../../../Context/AuthContext';
import { auth} from '../../../Firebase/Firebase'
import { useFirebaseHook } from '../../../Firebase/FireBaseHook'
import { getSelectedDeco } from '../../../Firebase/FirebaseUtils.js';
import ProfilePic from '../ProfilePage/Components/ProfilePicture/ProfilePic.js';
import axios from 'axios';
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

    //Fetch game data when the user state is updated
    useEffect(() => {
        if (user) {
            fetchGameData(user.SteamID);
            fetchDeco();
        }
    }, [user]);

    //Get user's decorations
    const fetchDeco = async () => {
        const banner = await getSelectedDeco(auth.currentUser.uid)
        // console.log(banner)
        if(banner != null){
            setDecoImg(banner.img);
        }
    };

    //Function to fetch game data
    const fetchGameData = async (id = steamID) => {
        setLoading(true);
        try {
            const cachedData = JSON.parse(localStorage.getItem("gameDataCache"));
            const currentTime = Date.now();
            var gameData = null;
            //If 5 minutes have passed, fetch gamedata from API and update cache with it. Otherwise, use cache data
            if(cachedData && cachedData.timestamp && cachedData.uid == user.SteamID && currentTime - cachedData.timestamp <= 5 /*Minutes*/ * 60 /*Seconds*/ * 1000 /*Milliseconds*/){ //I LOVE INLINE COMMENTS I JUST REMEMBERED I CAN DO THIS ON THE LITERAL LAST DAY
                //console.log("Fetching cached data...");
                gameData = cachedData.data;
            } else {
                //console.log("Cache expired or not found, fetching data from steamAPI...");
                gameData = await GetGameByUserID(id, serverURL, serverPort);
                localStorage.setItem(
                    "gameDataCache",
                    JSON.stringify({
                        data: gameData,
                        timestamp: currentTime,
                        uid: id
                    })
                );
            }
            setGameData(gameData);
            if(user && user.SelectedGame) {
                // console.log(user.SelectedGame)
                // console.log(gameData.find((game) => game.appid == user.SelectedGame))
                setSelectedGame(gameData.find((game) => game.appid == user.SelectedGame))
            }
        } catch (err) {
            setError(err);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    //Handle search for gamedata, used for the SteamID search if user is not logged in
    const handleSearch = async () => {
        const visibility = await axios.get(`http://${serverURL}:${serverPort}/api/getProfileVisibility/${steamID}`);
        if (visibility.data.profileState !== 3) {
            alert("Search Failed - Steam id is not public or is invalid");
            return;
        }

        fetchGameData();
    }

    //Pick a random game from the list of games
    const pickRandomGame = () => {
        if (gameData.length === 0) {
            return;
        }
        let incompleteGameData = gameData.filter(game => game.playtime_forever < 120);
        const randomIndex = Math.floor(Math.random() * incompleteGameData.length);
        setRandomGame(incompleteGameData[randomIndex]);
        console.log(incompleteGameData[randomIndex]);
    }

    //Select currently shown random game
    const selectGame = async () => {
        if(isAuthenticated) {
            const authUser = auth.currentUser;
            await addSelectedGame(authUser.uid, user, randomGame.appid);
            setRandomGame(null);
        }
    }

    //Removed selected game and give the user points
    const claimGame = async() => {
        if(isAuthenticated) {
            const authUser = auth.currentUser;
            await removeSelectedGame(authUser.uid, user);
            setRandomGame(null);
            setSelectedGame(null);
        }
    }

    //States for the random wheel
    const segments = [];
    const [spinning, setSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);

    //Spin wheel and set the random game to a random one once done
    const spinWheel = () => {
        if (spinning) return; // Prevent multiple spins
        const spinTo = Math.floor(Math.random() * 360 + 720); // Minimum 2 full spins
        setRotation((prev) => prev + spinTo);
        setSpinning(true);
        setTimeout(() => {
        setSpinning(false);
        const winningSegment = segments[Math.floor(((rotation + spinTo) % 360) / (360 / segments.length))];
        //console.log(gameData.filter(game => game.name == winningSegment))
        setRandomGame(gameData.filter(game => game.name == winningSegment)[0]);
        }, 3000); // Match animation duration
    };
    
    //Set wheel segments to game data
    gameData.filter(game => game.playtime_forever < 120).map(game => (segments.push(game.name)))

    return (
    <div class="app__main_container">
        <div class="app__searchBar">
            {user && user.Inventory &&user.Inventory.Icons ? 
            <div class ="app_user-profile-container">
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
        
            
        {gameData == 0? 
        <div>
            <h2>No Games were found</h2>
        </div>
        :
        <div className="app__randomGameWheel">
                <h2 style={{alignSelf: `center`}}>
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
                <button onClick={spinWheel} disabled={(spinning || selectedGame)} className="spin-button">
                    Spin
                </button>
            </div>
                

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
    }   
            
        
    </div>
  )
}

export default MainRandomGamePage

