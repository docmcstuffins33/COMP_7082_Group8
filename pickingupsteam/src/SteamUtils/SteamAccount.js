
import axios from 'axios';

/*Gets a game from the server given a userID, serverURL, and serverPort. Returns a json list, or an error if something goes wrong.*/
async function GetGameByUserID(userID, serverURL, serverPort){

    if(!userID){
        return []
    }
    try {
        // ######### YOU NEED TO HAVE THE SERVER RUNNING FOR THIS TO WORK!!! ###########
        // #########     IF YOU DO NOT, THE WEBSITE WILL SIMPLY NOT LOAD     ###########
        let response;

        // Check if server URL is http or https for deployment
        if(!serverPort || serverPort === ""){
            console.log("--------------------Https declared in server URL---------------------");
            
            response = await axios.get(`https://${serverURL}/api/gamesByUser/${userID}`);
        }
        else{
            response = await axios.get(`http://${serverURL}:${serverPort}/api/gamesByUser/${userID}}`);
        }
        
        // console.log(response.data)
        const filteredList = response.data.applist.apps.filter(x => x.name)
        return filteredList;

    } catch (err) {
        console.error(err);
        return []
    }
}

export default GetGameByUserID