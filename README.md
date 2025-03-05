# IPTV Web App

A browser-based IPTV player that allows you to load and watch your IPTV channels directly in the browser. This application is built with React and works as a fully client-side solution with no backend required.

## Features

- **M3U Playlist Support**: Load your IPTV playlist directly from a URL
- **Channel Organization**: Browse channels by groups
- **Search Functionality**: Search for specific groups or channels
- **Video Playback**: Built-in player with HLS support
- **Playback Controls**: Play, pause, stop, fullscreen, and volume controls
- **Responsive Design**: Works on desktop and mobile devices

## Requirements

- A modern web browser (Chrome, Firefox, Safari, Edge)
- An M3U playlist URL that supports CORS (Cross-Origin Resource Sharing)

## Installation

### Option 1: Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/iptv-web-app.git
   cd iptv-web-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Option 2: Production Build

1. Build the application:
   ```bash
   npm run build
   ```

2. The build files will be in the `build` directory, which you can serve with any static file server.

## Usage

1. Enter your M3U playlist URL in the input field
2. Click "Load Playlist" to load your channels
3. Browse through the groups in the left sidebar
4. Click on a group to see its channels
5. Click on a channel to start playback
6. Use the player controls to manage playback

## CORS Considerations

As this is a client-side application, you may encounter CORS (Cross-Origin Resource Sharing) issues when loading M3U playlists from certain servers. To resolve this:

- Use M3U playlists from servers that allow cross-origin requests
- Use a CORS proxy service if you control the M3U file source
- For personal use, you can use browser extensions to disable CORS restrictions

