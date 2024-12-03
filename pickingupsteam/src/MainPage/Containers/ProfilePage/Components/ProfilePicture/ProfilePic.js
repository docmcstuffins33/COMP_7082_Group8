import React, { useEffect } from 'react'
import { useState } from 'react'
import { useAuth } from '../../../../../Context/AuthContext';
import { auth } from '../../../../../Firebase/Firebase';
import { getProfilePic, uploadProfilePic, writeUser} from '../../../../../Firebase/FirebaseUtils'
import { getSelectedDeco } from '../../../../../Firebase/FirebaseUtils';
import "./ProfilePic.css"

/*Profile Picture component, takes in a prop "editable" which is a boolean that determines whether it should include the file uploader.*/
export default function ProfilePic({editable}) {

    const { user, isAuthenticated, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [picToUpload, setPicToUpload] = useState(null);
    const [fileName, setFileName] = useState("No File Selected");
    const [decoImg, setDecoImg] = useState(null);
    const [pic, setPic] = useState("Profile_Default.png");

    //Updates the user's picture and profile decoration when the user logs in/out or when a new file finishes uploading.
    useEffect(() => {
        if(user)
            fetchPic();
            fetchDeco();
    }, [user, loading])

    //Fetches the user's profile picture from firebase storage.
    const fetchPic = async () => {
        var picPath;
        if(typeof user.photoURL === undefined || user.photoURL == null){
            picPath = await getProfilePic("ProfilePictures/Profile_Default.png")
        } else {
            picPath = await getProfilePic(user.photoURL)
        }
        
        setPic(picPath); 
    };

    //Fetches the user's profile decoration from firebase storage.
    const fetchDeco = async () => {
        const banner = await getSelectedDeco(auth.currentUser.uid)
        if(banner != null){
            setDecoImg(banner.img);
        }
    };

    //Stages the file for upload from the file uploader.
    async function handleChange(e){
        if (e.target.files[0]) {
            const file = e.target.files[0];
            setPicToUpload(file);
            setFileName(file.name);
        }
    }

    //Uploads the file when the upload button is clicked.
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

    /*----Actual profile picture layout starts here----*/
    return (
        <>
            <div className="profilePictureHolder">
                <img className="profileDeco" src={decoImg}/>
                <img className="profilePic" src={pic}/>
            </div>
            {/*Conditional rendering displays the uploading options if the prop "editable" is passed in.*/}
            {editable && <div className='uploadDiv'>
                <label for="fileBtn" class="fileUploadLabel">Select File...</label>
                <input id="fileBtn" type="file" onChange={handleChange} accept="image/png, image/jpg, image/jpeg"></input>
                <p className='fileName'>{fileName}</p>
                <button disabled={loading || !picToUpload} className="uploadBtn" onClick={handleClick}>Upload</button>
                </div>}
            
        </>
    );
}