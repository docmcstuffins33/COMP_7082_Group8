import React, { useEffect } from 'react'
import { useState } from 'react'
import { useAuth } from '../../../../../Context/AuthContext';
import { auth } from '../../../../../Firebase/Firebase';
import { getProfilePic, uploadProfilePic, writeUser} from '../../../../../Firebase/FirebaseUtils'
import { getSelectedDeco } from '../../../../../Firebase/FirebaseUtils';
import "./ProfilePic.css"

export default function ProfilePic({editable}) {

    const { user, isAuthenticated, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [picToUpload, setPicToUpload] = useState(null);
    const [fileName, setFileName] = useState("No File Selected");
    const [decoImg, setDecoImg] = useState(null);
    const [pic, setPic] = useState("Profile_Default.png");
    useEffect(() => {
        if(user)
            console.log(user)
            console.log(auth.currentUser)
            fetchPic();
            fetchDeco();
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

    const fetchDeco = async () => {
        const banner = await getSelectedDeco(auth.currentUser.uid)
        console.log(banner)
        if(banner != null){
            setDecoImg(banner.img);
        }
    };

    async function handleChange(e){
        if (e.target.files[0]) {
            const file = e.target.files[0];
            setPicToUpload(file);
            setFileName(file.name);
        }
    }

    async function handleClick(){
        const authUser = auth.currentUser;
        setFileName("No File Selected");
        setLoading(true);

        uploadProfilePic(picToUpload, authUser.uid, user, setLoading).then(() => {
            fetchPic().then(() => {
                setLoading(false);
                alert("Profile Picture uploaded!")
            });
        });

        
    }

    return (
        <>
            <div className="profilePictureHolder">
                <img className="profileDeco" src={decoImg}/>
                <img className="profilePic" src={pic}/>
            </div>
            {editable && <div className='uploadDiv'>
                <label for="fileBtn" class="fileUploadLabel">Select File...</label>
                <input id="fileBtn" type="file" onChange={handleChange} accept="image/png, image/jpg, image/jpeg"></input>
                <p className='fileName'>{fileName}</p>
                <button disabled={loading || !picToUpload} className="uploadBtn" onClick={handleClick}>Upload</button>
                </div>}
            
        </>
    );
}