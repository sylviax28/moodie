import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { FastAverageColor } from 'fast-average-color';

const Dashboard = ({ accessToken }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [showTopTracks, setShowTopTracks] = useState(false);
  const [bgColor, setBgColor] = useState('#242424');

  useEffect(() => {
    if (!accessToken) return;

    const fetchData = () => {
      axios
        .get('https://api.spotify.com/v1/me/player/currently-playing', {
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
        })
        .then((response) => {
          console.log('Currently playing:', response.data);
          if (response.data && response.data.item) {
            const track = response.data.item;
            setCurrentTrack(track);

            // Extract album art color
            const fac = new FastAverageColor();
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = track.album.images[0].url;

            img.onload = () => {
              fac
                .getColorAsync(img)
                .then((color) => {
                  setBgColor(color.hex);
                })
                .catch((err) => {
                  console.error('Color extraction failed:', err);
                });
            };
          } else {
            setCurrentTrack(null);
            console.log('No track currently playing.');
          }
        })
        .catch((err) => {
          console.error('Error fetching data:', err);
          if (err.response?.status === 401) {
            localStorage.removeItem('spotify_access_token');
            window.location.href = '/';
          }
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [accessToken]);

  const handleShowTopTracks = () => {
    if (!showTopTracks) {
      axios
        .get(
          'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10',
          { headers: { Authorization: 'Bearer ' + accessToken } }
        )
        .then((res) => {
          setTopTracks(res.data.items);
          setShowTopTracks(true);
        })
        .catch((err) => {
          console.log('Could not fetch top tracks.');
        });
    } else {
      setShowTopTracks(false);
    }
  };

  return (
    <div
      className='DashboardContainer'
      style={{
        backgroundColor: bgColor,
        color: 'white',
        transition: 'background-color 0.5s ease',
      }}
    >
      <div className={showTopTracks ? 'DashboardMain' : 'DashboardCenter'}>
        <div className='LeftDashboard'>
          {currentTrack ? (
            <>
              <p>Now playing: {currentTrack.name}</p>
              <p>
                Artist:{' '}
                {currentTrack.artists.map((artist) => artist.name).join(', ')}
              </p>
              {currentTrack.album?.images?.length > 0 && (
                <img
                  src={currentTrack.album.images[0].url}
                  alt='Album cover'
                  width='200'
                />
              )}
            </>
          ) : (
            <h2>
              Not currently playing any tracks. Play a track on Spotify to see
              your song's mood and more!
            </h2>
          )}
        </div>

        <div className='RightDashboard'>
          {showTopTracks && (
            <div style={{ marginTop: '20px' }}>
              <h3>Last Month's Top 10 Songs</h3>
              <ol>
                {topTracks.map((track) => (
                  <li key={track.id}>
                    {track.name} &ndash;{' '}
                    {track.artists.map((a) => a.name).join(', ')}
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <button onClick={handleShowTopTracks}>
              {showTopTracks ? 'Hide Top 10 Songs' : 'Show My Top 10 Songs'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
