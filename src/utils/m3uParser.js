// src/utils/m3uParser.js

/**
 * Parse an M3U playlist content string
 * @param {string} content - The M3U playlist content as a string
 * @returns {Object} - Object with channels and groups
 */
export const parseM3u = (content) => {
    try {
      // Parse the M3U content
      const lines = content.split('\n');
      const channels = [];
      let currentChannel = null;
      let groups = {};
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line.startsWith('#EXTINF:')) {
          // Extract channel info
          currentChannel = {};
          
          // Extract channel name
          const nameMatch = line.match(/,(.+)$/);
          if (nameMatch && nameMatch[1]) {
            currentChannel.name = nameMatch[1].trim();
          }
          
          // Extract group name
          const groupMatch = line.match(/group-title="([^"]*)"/);
          if (groupMatch && groupMatch[1]) {
            currentChannel.group = groupMatch[1];
            // Add to groups if it doesn't exist
            if (!groups[currentChannel.group]) {
              groups[currentChannel.group] = [];
            }
          } else {
            currentChannel.group = 'Ungrouped';
            if (!groups['Ungrouped']) {
              groups['Ungrouped'] = [];
            }
          }
          
          // Extract logo URL
          const logoMatch = line.match(/tvg-logo="([^"]*)"/);
          if (logoMatch && logoMatch[1]) {
            currentChannel.logo = logoMatch[1];
          }
          
          // Extract channel ID
          const idMatch = line.match(/tvg-id="([^"]*)"/);
          if (idMatch && idMatch[1]) {
            currentChannel.id = idMatch[1];
          } else {
            currentChannel.id = `channel-${channels.length}`;
          }
        } else if (line.length > 0 && !line.startsWith('#') && currentChannel) {
          // This is the URL for the channel
          currentChannel.url = line;
          channels.push(currentChannel);
          
          // Add channel to its group
          groups[currentChannel.group].push(currentChannel);
          
          currentChannel = null;
        }
      }
      
      return { 
        channels, 
        groups: Object.keys(groups).map(name => ({
          name,
          channels: groups[name]
        }))
      };
    } catch (error) {
      console.error('Error parsing M3U:', error);
      throw new Error('Failed to parse M3U playlist');
    }
  };
  
  /**
   * Load and parse an M3U playlist from a URL
   * @param {string} url - The URL of the M3U playlist
   * @returns {Promise<Object>} - Promise resolving to an object with channels and groups
   */
  export const loadM3uFromUrl = async (url) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          // Adding these headers for potential CORS issues
          'Accept': 'text/plain',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const content = await response.text();
      return parseM3u(content);
    } catch (error) {
      console.error('Error loading M3U from URL:', error);
      throw new Error('Failed to load playlist from URL. The server might not allow cross-origin requests.');
    }
  };