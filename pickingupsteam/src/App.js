import {useState, useEffect} from 'react';

import './index.css'
import axios from 'axios';


function App() {
    const [gameData, setGameData] = useState([]);
    const [userID, setUserID] = useState(process.env.REACT_APP_STEAM_USER_ID);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchGameData = async () => {
            try {
              // ######### YOU NEED TO HAVE THE SERVER RUNNING FOR THIS TO WORK!!! ###########
              // #########     IF YOU DO NOT, THE WEBSITE WILL SIMPLY NOT LOAD     ###########
              // Also ideally there should be some way to dynamically change the user id sent here. Do this later!
                //const response = await axios.get('http://localhost:8080/api/gamesByUser/' + userID);
                const response = await axios.get('http://localhost:8080/api/gamesByUser/' + "76561198290514792");
                console.log(response.data)
                const filteredList = response.data.applist.apps.filter(x => x.name)
                setGameData(filteredList); // Adjust according to the structure of the response
            } catch (err) {
                setError('Error fetching data from server');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchGameData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
  
  
  
 return (
  <body>
  <div className="content">
     <p>This is a simple home page with a navbar containing just a title and a login button.</p>
     <ul>
        {gameData.map(app => (
          <li key={app.appid}>{app.name}</li>
        ))}
      </ul>
   </div>
   </body>
 )
}



export default App;
