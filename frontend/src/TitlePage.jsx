import React from 'react';
import './index.css';

const TitlePage = () => {
    const redirect_uri = 'http://127.0.0.1:5173/callback';
    const client_id = "38fa3ce2d5564becb8543f9409eaec1f";
    const AUTHORIZE = "https://accounts.spotify.com/authorize";
    const scope = [
        'user-read-currently-playing',
        'user-read-recently-played',
        'user-top-read'
    ].join(' ');

    const requestAuthorization = () => {
        let url = AUTHORIZE;
        url += "?client_id=" + client_id;
        url += "&response_type=code";
        url += "&redirect_uri=" + encodeURIComponent(redirect_uri);
        url += "&scope=" + encodeURIComponent(scope);
        url += "&show_dialog=true";
        
        window.location.href = url;
    };
    

    return (
        <div className="title-page">
            <h1>Moodie</h1>
            <button onClick={requestAuthorization}>Log in with Spotify</button>
        </div>
    );
};

export default TitlePage;