import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { GetGameByUserID } from '../../../SteamUtils';
import './AchievementsPanel.css';
import { auth } from '../../../Firebase/Firebase';
import { useFirebaseHook } from '../../../Firebase/FireBaseHook'
import { useAuth } from '../../../Context/AuthContext';
import { addAchievements, removeAchievements } from '../../../Firebase/FirebaseUtils';
import axios from 'axios';

/*Achievements panel component, as seen on homepage.*/
const AchievementsPanel = () => {
    const [isLoading, setLoading] = useState(true);

    const [isOpen, setIsOpen] = useState(false);

    const { user, isAuthenticated } = useAuth();

    const [serverURL, setServerURL] = useState(process.env.REACT_APP_SERVER_URL);
    const [serverPort, setServerPort] = useState(process.env.REACT_APP_SERVER_PORT);
    
    const [achievements, setAchievements] = useState([]);
    const [threeAchievements, setThreeAchievements] = useState([]);
    const [gameNames, setGameNames] = useState([]);

    const [boxVisbility, setBoxVisibility] = useState([true, true, true])

    const {addCreditToUser } = useFirebaseHook();
    const [showPanel, setShowPanel] = useState(false);
    const [panelsClaimed, setPanelsClaimed] = useState(0);

    const togglePanel = () => {
        setIsOpen(!isOpen);
    };

    //Randomly shuffles a list of games
    const GenerateRandomShuffle = (games) => {
        const shuffledIndices = Array.from({ length: games.length }, (_, i) => i);

        let currIndex = games.length;
        while (currIndex !== 0) {
            let randomIndex = Math.floor(Math.random() * currIndex);
            currIndex--;

            [shuffledIndices[currIndex], shuffledIndices[randomIndex]] = [shuffledIndices[randomIndex], shuffledIndices[currIndex]];
        }

        return shuffledIndices.map(i => games[i]);
    };

    //Gets the achievements of a game given its steam appID. See Server/index.js for more details on the specifics.
    const GetGameAchievements = async(appid) => {
        try {
            const response = await axios.get(`http://${serverURL}:${serverPort}/api/achievementsByAppid/${user.SteamID}/${appid}`);
            const gameAchievements = response.data.applist.apps;

            return gameAchievements ? gameAchievements.filter(achievement => achievement.achieved === 0) : [];
        } catch (error) {
            console.error("Error fetching achievements for appid", appid, error);
            return [];
        }
    };

    //Gets 3 random achievements from the currently set achievements variable, then sets the threeAchievements state variable to said 3 achievements.
    const GetRandomAchievements = async () => {
        const randomAchievements = new Map(); // Holds the random achievements by AppID
    
        // Iterate over the games in achievements (now assumed to be an array of game data)
        for (const achievementData of achievements) {
            const { appid, achievements: gameAchievements } = achievementData;
    
            // Ensure the game has achievements and they are unachieved
            if (!gameAchievements || gameAchievements.length === 0) {
                console.warn(`No unachieved achievements found for AppID: ${appid}`);
                continue;
            }
    
            // Pick a random achievement from the game's unachieved list
            const randomIndex = Math.floor(Math.random() * gameAchievements.length);
            const randomAchievement = gameAchievements[randomIndex];
    
            // Ensure the random achievement is valid
            if (!randomAchievement || !randomAchievement.name) {
                console.warn(`Invalid achievement at index ${randomIndex} for AppID: ${appid}`);
                continue;
            }
    
            // Fetch schema data for the achievement
            const schema = await GetAchievementSchema(appid, randomAchievement.name);
    
            if (!schema) {
                console.warn(`Schema not found for Achievement: ${randomAchievement.name} in AppID: ${appid}`);
                continue;
            }
    
            // Add the achievement schema to the map for later use
            randomAchievements.set(appid, schema);
        }
    
        // Set the state with the random achievements map
        setThreeAchievements(randomAchievements);

        if (isAuthenticated)
        {
            const authUser = auth.currentUser;
        
            await addAchievements(authUser.uid, user, randomAchievements);
        }
    };    

    //Gets the Achievement Schema for a given game (appID) and achievement name.
    const GetAchievementSchema = async(appid, achievementName) => {
        try {
            const response = await axios.get(`http://${serverURL}:${serverPort}/api/achievementSchemaByAppid/${appid}`);
            const achievements = response.data.applist.apps;
            const achievement = achievements.find(x => x.name === achievementName) || {};

            return achievement;
        } catch (error) {
            console.error("Error fetching achievement schema", appid, achievementName, error.message);
            return [];
        }
    };

    //Gets 3 random games from the user's steam library.
    const GetThreeGames = async () => {
        if (!user) return;

        let allGames = await GetGameByUserID(user.SteamID, serverURL, serverPort);
        //Filter to only games with less than 30 minutes of playtime - may not be necessary, but it's how we've decided to do it.
        const under30Minutes = allGames.filter(game => game.playtime_forever <= 30);
        const names = [];

        //If achievement data is in Firebase database use that instead of generating new games
        if (user.Achievements) {
            const achievementMap = new Map(Object.entries(user.Achievements));
            for (const game of under30Minutes) {
                for (const appid of achievementMap.keys()) {
                    if(game.appid == appid) {
                        names.push(game.name);
                    }
                }
            }

            console.log(names);

            setGameNames(names);
            setThreeAchievements(achievementMap);
            return;
        }

        const shuffledGames = GenerateRandomShuffle(under30Minutes);
    
        const gamesWithAchievements = [];
        for (const game of shuffledGames) {
            const unachieved = await GetGameAchievements(game.appid);
    
            if (unachieved.length > 0) {
                gamesWithAchievements.push({
                    appid: game.appid,
                    achievements: unachieved,
                });

                names.push(game.name);
            }
    
            if (gamesWithAchievements.length === 3) break;
        }
    
        setGameNames(names)
        setAchievements(gamesWithAchievements);
    };
    
    //Check whether the user has achieved a given achievement.
    const HasAchieved = async(appid, achievementName) => {
        const response = await axios.get(`http://${serverURL}:${serverPort}/api/achievementsByAppid/${user.SteamID}/${appid}`);
        const gameAchievements = response.data.applist.apps;
        const gameAchievement = gameAchievements.filter(x => x.name === achievementName)[0];

        return gameAchievement.achieved;
    };

    //If the user is authenticated and has achieved the given achievement, adds the credits for the reward to their account.
    const claimReward = async(boxId, points, appid, achievementName) => {
        if (isAuthenticated) {
            const hasAchieved = await HasAchieved(appid, achievementName);
            if (hasAchieved) {
                const authUser = auth.currentUser;
                addCreditToUser(authUser.uid, user, points);
            }
            else {
                return;
            }
        }

        //Handle the UI updates after claiming an achievements.
        setBoxVisibility((prevVisibility) => {
            const newVisibility = [...prevVisibility];
            newVisibility[boxId] = false;
            return newVisibility;
        });

        setPanelsClaimed(panelsClaimed + 1);
    };

    //Resets everything when all achievement panels have been claimed.
    useEffect(() => {
        if (panelsClaimed >= 3) {
            const resetAchievements = async () => {
                const authUser = auth.currentUser;
                setAchievements([]);
                setThreeAchievements([]);
                setPanelsClaimed(0);
                setBoxVisibility([true, true, true]);
                await removeAchievements(authUser.uid, user);
    
                GetThreeGames();
            };
    
            resetAchievements();
        }
    }, [panelsClaimed]);

    //Hides the achievement panel on pages other than the main page.
    useEffect(() => {
        const interval = setInterval(() => {
            const currentPath = window.location.pathname;
            if (currentPath === '/home' || currentPath === "/") {
                setShowPanel(true);
            } else {
                setShowPanel(false);
            }
        }, 100);
    
        return () => clearInterval(interval);
    }, []);    

    //Gets games when the user becomes authenticated.
    useEffect(() => {
        if (isAuthenticated) {
            try {
                GetThreeGames();
            } catch (error) {
                console.error("Error fetching achievements: " + error);
            }
        }
    }, [isAuthenticated]);

    //Get random achievements when the list of all achievements changes.
    useEffect(() => {
        if(achievements.length > 0)
        {
            try {
            GetRandomAchievements()
            } catch (error) {
                console.error("Error choosing random achievements: " + error);
            } finally {
                setLoading(false);
            }
        }
    }, [achievements]);

    //Display a loading message while the achievements are loading.
    if (isLoading) {
        <div className="loading">loading</div>
    }

    /*----Actual achievements panel layout starts here----*/
    return (
        <div>
            {isAuthenticated && showPanel && (
                <button
                    className={`toggle-button ${isOpen ? 'button-open' : 'button-closed'}`}
                    onClick={togglePanel}
                >

                    {isOpen ? '←' : '→'}
                </button>
            )}

            <div className={`side-panel ${isOpen ? 'open' : 'closed'}`}>
                <h2 className="panel-title">Achievements</h2>
                <button className="refresh-button" onClick={() => setPanelsClaimed(3)}>Refresh</button>
                {/* Iterate over the entries of the threeAchievements Map */}
                {Array.from(threeAchievements.entries()).map(([appid, schema], index) => (
                    // Check visibility and ensure schema is valid
                    schema && boxVisbility[index] && (
                        <div className="achievement-box" key={appid}>
                            {/* Render achievement icon, use placeholder if not found */}
                            <span className="game-name">
                                {gameNames[index]}
                            </span>
                            <img
                                src={schema.icon || '/placeholder-icon.png'}
                                alt={schema.displayName || 'Achievement'}
                                className="achievement-image"
                            />
                            <span className="achievement-text">
                                {schema.displayName || 'Unknown Achievement'}
                            </span>
                            <span className="achievement-number">
                                {schema.points || 100} Points
                            </span>
                            <div className="button-group">
                                {/* Claim button with points from schema */}
                                <button
                                    className="claim-button"
                                    onClick={() => claimReward(index, schema.points || 100, appid, schema.name)}
                                >
                                    Claim
                                </button>
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};

export default AchievementsPanel;
