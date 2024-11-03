import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { GetGameByUserID } from '../../../SteamUtils';
import './AchievementsPanel.css';
import { auth } from '../../../Firebase/Firebase';
import { useFirebaseHook } from '../../../Firebase/FireBaseHook'


const AchievementsPanel = () => {

    const [isOpen, setIsOpen] = useState(false);

    const { user, isAuthenticated } = useSelector(state => state.auth);

    const [serverURL, setServerURL] = useState(process.env.REACT_APP_SERVER_URL);
    const [serverPort, setServerPort] = useState(process.env.REACT_APP_SERVER_PORT);
    
    const [games, setGames] = useState([]);
    const [achievements, setAchievements] = useState([]);

    const [boxVisbility, setBoxVisibility] = useState([true, true, true])

    const {addCreditToUser, removeCreditFromUser } = useFirebaseHook();

    const togglePanel = () => {
        setIsOpen(!isOpen);
    };

    const getGamesWithLessThan20Minutes = async () => {
        let games = await GetGameByUserID(user.SteamID, serverURL, serverPort);
        const filteredGames = games.filter(game => game.playtime_forever < 20);
        setGames(filteredGames);

        /*
        for(const game in games)
        {
            achievements.concat(getAchievements(game.appid));
        }
        */
        //setAchievements(achievements);
    };

    /*
    const getAchievements = async(appid) => {
        const response = await fetch(`https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?key=${process.env.REACT_APP_STEAM_API_KET}&steamid=${user.SteamID}&appid=${appid}`);

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();

        const unachieved = data.playerstats.achievements.filter(
            (achievement) => achievement.achieved === 0
        );

        return unachieved;
    }
    */

    const claimReward = async(boxID, points) =>
    {
        if(isAuthenticated) {
            const authUser = auth.currentUser;
            addCreditToUser(authUser.uid, user, points);
        }

        setBoxVisibility((prevVisibility) => {
            const newVisibility = [...prevVisibility];
            newVisibility[boxID] = false; // Hide the specific box
            return newVisibility;
          });
    }

    useEffect(() => {
        if (isAuthenticated) {
            getGamesWithLessThan20Minutes(); // Fetch games with low playtimes
        }
    }, [isAuthenticated, user]);

    return (
        <div>
            {isAuthenticated && (
                <button
                    className={`toggle-button ${isOpen ? 'button-open' : 'button-closed'}`}
                    onClick={togglePanel}
                >
                    {isOpen ? '←' : '→'}
                </button>
            )}

            <div className={`side-panel ${isOpen ? 'open' : 'closed'}`}>
                <h2 className="panel-title">Rewards</h2>
                
                {boxVisbility[0] && (
                    <div className="achievement-box">
                        <img src={ require("./Hl2_beat_toxictunnel.png")} alt="Achivement 1" className="achievement-image"/>
                        <span className="achievement-text">"Radiation Levels Detected"</span>
                        <span className="achievement-number">100 Points</span>
                        <div className="button-group">
                            <button className="claim-button" onClick={() => claimReward(0, 100)}>Claim</button>
                            <button className="refresh-button">Refresh</button>
                        </div>
                    </div>
                )}

                {boxVisbility[1] && (
                    <div className="achievement-box">
                        <img src={ require("./Hl2_kill_enemies_withcrane.png")} alt="Achievement 2" className="achievement-image"/>
                        <span className="achievement-text">OSHA Violation</span>
                        <span className="achievement-number">150 Points</span>
                        <div className="button-group">
                            <button className="claim-button" onClick={() => claimReward(1, 150)}>Claim</button>
                            <button className="refresh-button">Refresh</button>
                        </div>
                    </div>
                )}

                {boxVisbility[2] && (
                    <div className="achievement-box">
                        <img src={ require("./Hl2_get_crowbar.png")} alt="Achievement 3" className="achievement-image"/>
                        <span className="achievement-text">Trusty Hardware</span>
                        <span className="achievement-number">50 points</span>
                        <div className="button-group">
                            <button className="claim-button" onClick={() => claimReward(2, 50)}>Claim</button>
                            <button className="refresh-button">Refresh</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AchievementsPanel;
