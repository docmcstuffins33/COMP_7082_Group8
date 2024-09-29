import React from 'react';
import { Outlet, Link } from "react-router-dom";
import './index.css';


function Store() {
    //For now, just making dummy arrays of hypothetical decorations will work.
    //Eventually, these should probably be loaded dynamically from a database, either local or online
    const profileDecorations = [
        {"name":"Starstruck", "cost":150, "img":"https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"},
        {"name":"Poker Chip", "cost":200, "img":"https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"},
        {"name":"Hanging Vines", "cost":350, "img":"https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"},
        {"name":"Nebula", "cost":500, "img":"https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"},
        {"name":"Whimsical Hat", "cost":500, "img":"https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"}
    ];
    const profileThemes = [
        {"name":"Forest Sunrise", "cost":500, "img":"https://media.istockphoto.com/id/1354776457/vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo.jpg?s=612x612&w=0&k=20&c=w3OW0wX3LyiFRuDHo9A32Q0IUMtD4yjXEvQlqyYk9O4="},
        {"name":"Cityscape", "cost":500, "img":"https://media.istockphoto.com/id/1354776457/vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo.jpg?s=612x612&w=0&k=20&c=w3OW0wX3LyiFRuDHo9A32Q0IUMtD4yjXEvQlqyYk9O4="},
        {"name":"Eruption", "cost":500, "img":"https://media.istockphoto.com/id/1354776457/vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo.jpg?s=612x612&w=0&k=20&c=w3OW0wX3LyiFRuDHo9A32Q0IUMtD4yjXEvQlqyYk9O4="},
        {"name":"Galaxies", "cost":500, "img":"https://media.istockphoto.com/id/1354776457/vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo.jpg?s=612x612&w=0&k=20&c=w3OW0wX3LyiFRuDHo9A32Q0IUMtD4yjXEvQlqyYk9O4="}
    ];
  return (
    <>
    <h1>Points Shop</h1>
    <h2>Profile Decorations</h2>
    <div id='profileDecorations'>
        {profileDecorations.map(dec => (
            <div>
                <img class='rounded' src={dec.img} height="200px" width="200px"></img>
                <p key={dec.name}>{dec.name}</p>
                <button class='itemCost'>Cost: {dec.cost}</button>
            </div>
        ))}
    </div>
    <h2>Profile Themes</h2>
    <div id='profileThemes'>
        {profileThemes.map(dec => (
            <div>
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