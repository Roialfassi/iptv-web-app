// src/components/App.js
import React, { useState, useEffect } from 'react';
import Header from './Header';
import GroupList from './GroupList';
import ChannelList from './ChannelList';
import Player from './Player';
import { loadM3uFromUrl } from '../utils/m3uParser';
import '../styles/App.css';

function App() {
  const [m3uUrl, setM3uUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [groups, setGroups] = useState([]);
  const [channels, setChannels] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [filteredChannels, setFilteredChannels] = useState([]);
  const [groupSearch, setGroupSearch] = useState('');
  const [channelSearch, setChannelSearch] = useState('');
  const [isUrlEntered, setIsUrlEntered] = useState(false);

  // Load playlist when URL is submitted
  const handleLoadPlaylist = async () => {
    if (!m3uUrl) {
      setError('Please enter a valid M3U URL');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { groups, channels } = await loadM3uFromUrl(m3uUrl);
      setGroups(groups);
      setFilteredGroups(groups);
      setChannels(channels);
      setIsUrlEntered(true);
      
      // Save to localStorage for convenience
      localStorage.setItem('m3uUrl', m3uUrl);
    } catch (error) {
      setError('Failed to load playlist. Please check the URL and try again. Note: The server must allow cross-origin requests (CORS).');
      console.error('Error loading playlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter groups based on search
  useEffect(() => {
    if (groups.length > 0) {
      const filtered = groups.filter(group => 
        group.name.toLowerCase().includes(groupSearch.toLowerCase())
      );
      setFilteredGroups(filtered);
    }
  }, [groupSearch, groups]);

  // Filter channels based on search and selected group
  useEffect(() => {
    if (channels.length > 0) {
      let filtered = channels;
      
      if (selectedGroup) {
        filtered = channels.filter(channel => channel.group === selectedGroup.name);
      }
      
      if (channelSearch) {
        filtered = filtered.filter(channel => 
          channel.name.toLowerCase().includes(channelSearch.toLowerCase())
        );
      }
      
      setFilteredChannels(filtered);
    }
  }, [channelSearch, selectedGroup, channels]);

  // Handle group selection
  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setSelectedChannel(null);
  };

  // Handle channel selection
  const handleChannelSelect = (channel) => {
    setSelectedChannel(channel);
  };

  // Handle logout/reset
  const handleLogout = () => {
    localStorage.removeItem('m3uUrl');
    setM3uUrl('');
    setIsUrlEntered(false);
    setGroups([]);
    setChannels([]);
    setSelectedGroup(null);
    setSelectedChannel(null);
  };

  // Check for saved URL on component mount
  useEffect(() => {
    const savedUrl = localStorage.getItem('m3uUrl');
    if (savedUrl) {
      setM3uUrl(savedUrl);
      setIsUrlEntered(true);
      loadM3uFromUrl(savedUrl)
        .then(({ groups, channels }) => {
          setGroups(groups);
          setFilteredGroups(groups);
          setChannels(channels);
        })
        .catch(error => {
          console.error('Error loading saved playlist:', error);
          setError('Failed to load saved playlist');
          handleLogout();
        });
    }
  }, []);

  return (
    <div className="app-container">
      <Header onLogout={handleLogout} />

      {!isUrlEntered ? (
        <div className="url-input-container">
          <h2>Enter your M3U playlist URL</h2>
          <h3>Example: https://iptv-org.github.io/iptv/countries/il.m3u</h3>
          <br></br>
          <input
            type="text"
            value={m3uUrl}
            onChange={(e) => setM3uUrl(e.target.value)}
            placeholder="Enter m3u URL here"
            className="m3u-input"
          />
          <button onClick={handleLoadPlaylist} disabled={isLoading} className="load-button">
            {isLoading ? 'Loading...' : 'Load Playlist'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </div>
      ) : (
        <div className="main-content">
          <div className="sidebar">
            <div className="groups-section">
              <input
                type="text"
                placeholder="Search Groups..."
                value={groupSearch}
                onChange={(e) => setGroupSearch(e.target.value)}
                className="search-input"
              />
              <GroupList 
                groups={filteredGroups} 
                selectedGroup={selectedGroup}
                onGroupSelect={handleGroupSelect}
              />
            </div>
            
            <div className="channels-section">
              <input
                type="text"
                placeholder="Search Channels..."
                value={channelSearch}
                onChange={(e) => setChannelSearch(e.target.value)}
                className="search-input"
              />
              <ChannelList 
                channels={filteredChannels}
                selectedChannel={selectedChannel}
                onChannelSelect={handleChannelSelect}
              />
            </div>
          </div>
          
          <div className="player-section">
            <Player channel={selectedChannel} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;