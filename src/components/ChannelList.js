
// src/components/ChannelList.js
import React from 'react';
import '../styles/ChannelList.css';

const ChannelList = ({ channels, selectedChannel, onChannelSelect }) => {
  return (
    <div className="channel-list">
      <h3>Channels</h3>
      {channels.length === 0 ? (
        <p className="no-data">No channels found</p>
      ) : (
        <ul>
          {channels.map((channel) => (
            <li 
              key={channel.id}
              className={selectedChannel && selectedChannel.id === channel.id ? 'selected' : ''}
              onClick={() => onChannelSelect(channel)}
            >
              {channel.logo && (
                <img 
                  src={channel.logo} 
                  alt={channel.name} 
                  className="channel-logo"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA0ElEQVR4Ae3WMQqEMBSE4TiJtmJnYyEWHkE8hN1W3mQPYC+exOMYi4VdgriVMzACv+bxTQIJIf43ZEdFxDKe4x7PEZ/jJPWTvO/7QwjhpH5SVVWdyrJMmXPe1nVdT+onee/7QRJBEiEZkLOI2SJWGrHiiNVnrMJjJSJSIyJFJlImIoUmUqoy1fZdRMlYFBvOXSNWGjFrxGwRs0TMrYCUiUiRiRSJSI2IFJhIfWgf31ZEyljdRMlYFBvOXf81QdKQpHAMJLkkhzzX4ZwfhPC+0x9rSl7DBjjqDgAAAABJRU5ErkJggg=='; }}
                />
              )}
              <span className="channel-name">{channel.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChannelList;
