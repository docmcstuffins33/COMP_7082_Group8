import React, { useEffect } from 'react'
import { useState } from 'react'
import { useAuth } from '../../../Context/AuthContext';
import { auth} from '../../../Firebase/Firebase'
import { getProfilePic, uploadProfilePic, writeUser} from '../../../Firebase/FirebaseUtils'

export default function ProfilePic(props) {

    const { user, isAuthenticated, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [picToUpload, setPicToUpload] = useState(null);
    const [pic, setPic] = useState("Profile_Default.png");
    useEffect(() => {
        if(user)
            console.log(user)
            console.log(auth.currentUser)
            fetchPic();
    }, [user, loading])

    const fetchPic = async () => {
        console.log("URL ====== " + user.photoURL)
        var picPath;
        if(typeof user.photoURL === undefined || user.photoURL == null){
            picPath = await getProfilePic("ProfilePictures/Profile_Default.png")
        } else {
            picPath = await getProfilePic(user.photoURL)
        }
        
        setPic(picPath); 
    };

    async function handleChange(e){
        if (e.target.files[0]) {
            setPicToUpload(e.target.files[0])
        }
    }

    async function handleClick(){
        const authUser = auth.currentUser;
        uploadProfilePic(picToUpload, authUser.uid, user, setLoading);

        fetchPic();
    }

    return (
        <div className="profilePictureHolder">
            <img className="profilePic" src={pic}/>
            <input type="file" onChange={handleChange} accept="image/png, image/jpg, image/jpeg"></input>
            <button disabled={loading || !picToUpload} onClick={handleClick}>Upload</button>
        </div>

    );
}