import React, { useEffect, useState } from 'react';
import { fairyDustCursor } from "cursor-effects";
import TitlePage from './TitlePage';
import Dashboard from './Dashboard';
import './App.css';

function App() {
  // cursor effect
  useEffect(() => {
    const effect = new fairyDustCursor({
      colors: ["#b8d498", "#e0b1d9", "#a1b0d6"] 
    });

    return () => effect.destroy();
  }, []);

  // set default to title page
  const [page, setPage] = useState('title');

  // see if theres an active token in local storage
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('spotify_access_token'));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const storedToken = localStorage.getItem('spotify_access_token');
  
    // if theres a token, open to dashboard
    if (storedToken) {
      setAccessToken(storedToken);
      setPage('dashboard');
      return;
    }
  
    if (code) {
      fetch('http://localhost:8888/api/get_spotify_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.access_token) {
            localStorage.setItem('spotify_access_token', data.access_token);
            setAccessToken(data.access_token);
            setPage('dashboard');
            window.history.replaceState({}, document.title, '/');
          } else {
            return { error: 'No access token received' };
          }
        })
    }
  }, []);
  

  
  if (page === 'title') {
    return <TitlePage />;
  } else {
    return <Dashboard accessToken={accessToken} />;
  }
}


export default App;
