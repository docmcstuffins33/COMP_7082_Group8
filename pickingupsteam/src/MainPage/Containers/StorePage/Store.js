import React, { useEffect, useState } from 'react';
import { Outlet, Link } from "react-router-dom";
import './Store.css';
import { fetchAllIcons, getImage } from '../../../Firebase/FirebaseUtils';


function Store() {
    //For now, just making dummy arrays of hypothetical decorations will work.
    //Eventually, these should probably be loaded dynamically from a database, either local or online
    const profileThemes = [
        {"name":"Forest Sunrise", "cost":500, "img":"https://media.istockphoto.com/id/1354776457/vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo.jpg?s=612x612&w=0&k=20&c=w3OW0wX3LyiFRuDHo9A32Q0IUMtD4yjXEvQlqyYk9O4="},
        {"name":"Cityscape", "cost":500, "img":"https://media.istockphoto.com/id/1354776457/vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo.jpg?s=612x612&w=0&k=20&c=w3OW0wX3LyiFRuDHo9A32Q0IUMtD4yjXEvQlqyYk9O4="},
        {"name":"Eruption", "cost":500, "img":"https://media.istockphoto.com/id/1354776457/vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo.jpg?s=612x612&w=0&k=20&c=w3OW0wX3LyiFRuDHo9A32Q0IUMtD4yjXEvQlqyYk9O4="},
        {"name":"Galaxies", "cost":500, "img":"https://media.istockphoto.com/id/1354776457/vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo.jpg?s=612x612&w=0&k=20&c=w3OW0wX3LyiFRuDHo9A32Q0IUMtD4yjXEvQlqyYk9O4="}
    ];

    const [profileDecorations, setProfileDecorations] = useState([]);

    const handleFetchIcons = async () => {
        const icons = await fetchAllIcons();
        if (icons) {
            const iconPromises = icons.map(async icon => {
                const downloadPath = await getImage(icon.path);
                return { name: icon.name, cost: icon.cost, img: downloadPath };
            });
            const newIcons = await Promise.all(iconPromises);
            setProfileDecorations(newIcons); 
        }
    };

    useEffect(() => {
        handleFetchIcons();
        console.log(profileDecorations)
    }, [])

  return (
    <>
    <h1>Points Shop</h1>
    <h2>Profile Decorations</h2>
    <div id='profileDecorations'>
        {profileDecorations.map(dec => (
            <div>
                <img class="profileDeco" src={dec.img} height="230px" width="230px"></img>
                <img class="rounded dummyProfile" src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg" height="200px" width="200px"></img>
                <p key={dec.name}>{dec.name}</p>
                <button class='itemCost'>Cost: {dec.cost}</button>
            </div>
        ))}
    </div>
    <h2>Profile Themes</h2>
    <div id='profileThemes'>
        {profileThemes.map(dec => (
            <div key={dec.name}>
                <img src={dec.img} height="200px" width="300px"></img>
                <p key={dec.name}>{dec.name}</p>
                <button class='itemCost'>Cost: {dec.cost}</button>
            </div>
        ))}
    </div>
    </>
  );
};

function ProfileDecorationPanel(){

}

export default Store;