
import axios from 'axios';

async function GetGameByUserID(userID, serverURL, serverPort){

    if(!userID){
        return []
    }
    try {
        // ######### YOU NEED TO HAVE THE SERVER RUNNING FOR THIS TO WORK!!! ###########
        // #########     IF YOU DO NOT, THE WEBSITE WILL SIMPLY NOT LOAD     ###########
        // Also ideally there should be some way to dynamically change the user id sent here. Do this later!
        //const response = await axios.get('http://localhost:8080/api/gamesByUser/' + userID);
        let response;

        // Check if server URL is http or https for deployment
        if(serverURL.startwith("http://") || serverURL.startsWith("https://")){
            console.log("--------------------Http declared in server URL---------------------");
            response = await axios.get(`${serverURL}/api/gamesByUser/${userID}`);
        }
        else{
            response = await axios.get(`http://${serverURL}:${serverPort}/api/gamesByUser/${userID}}`);
        }
        
        console.log(response.data)
        const filteredList = response.data.applist.apps.filter(x => x.name)
        return filteredList;

    } catch (err) {
        console.error(err);
        return []
    }
}

export default GetGameByUserID