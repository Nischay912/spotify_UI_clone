# 🎵 Web Music Player

A sleek, responsive web-based music player that dynamically loads songs from folders and creates a Spotify-like experience right in your browser.

## ✨ Features

- **Dynamic Music Loading**: Automatically loads songs from folder structure
- **Album Display**: Shows album cards with cover art, title, and description
- **Playback Controls**: Play, pause, next, and previous track functionality
- **Progress Bar**: Visual seek bar with interactive seeking
- **Volume Control**: Adjustable volume with mute toggle
- **Responsive Design**: Works on desktop and mobile devices
- **Playlist View**: Sidebar showing all songs in current album

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic structure and audio element |
| **CSS3** | Modern styling with Flexbox and animations |
| **JavaScript (ES6+)** | Dynamic functionality and API interactions |
| **HTTP Server** | Local server for file handling |

# 📝 How to Add Music

## Folder Structure
1. Create a folder in `/songs/` directory (e.g., `/songs/my-album/`)
2. Add your MP3 files to the folder

## Required Files
- **MP3 Files**: Your music files in MP3 format
- **info.json**: Metadata file with album information
- **cover.jpg**: Album cover art (300×300 pixels recommended)

## info.json Format
```json
{
  "title": "Album Name",
  "description": "Artist Name • Year • Genre"
}
```
**Enjoy your music! 🎧**
