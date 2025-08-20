// Music Player Application
console.log("Music player application loaded successfully");

// Global variables
let songs = [];
let currentsong = new Audio();
let currfolder = "songs/ncss"; // Default folder

// Format time function remains unchanged
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }
    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    let formattedMinutes = minutes.toString().padStart(2, "0");
    let formattedSeconds = secs.toString().padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    try {
        currfolder = folder;
        
        // CRITICAL FIX: Changed from absolute URL to relative path
        // BEFORE: let a = await fetch(`http://127.0.0.1:3000/${currfolder}/`);
        // PROBLEM: Absolute URL caused infinite redirect loops between client and server
        // AFTER: Relative path prevents DNS resolution issues and redirect loops
        let a = await fetch(`/${currfolder}/`);
        
        // ADDED: Response validation
        if (!a.ok) {
            throw new Error(`Server returned ${a.status} ${a.statusText}`);
        }
        
        let response = await a.text();
        
        // ADDED: Empty response check
        if (!response) {
            console.error("Empty response from server - folder might not exist");
            return [];
        }
        
        let div = document.createElement("div")
        div.innerHTML = response;
        let as = div.getElementsByTagName("a")
        songs = []

        for (let i = 0; i < as.length; i++) {
            const element = as[i];
            if (element.href.endsWith(".mp3")) {
                // IMPROVEMENT: Simplified URL parsing
                // BEFORE: songs.push(element.href.split(`/${currfolder}/`)[1])
                // PROBLEM: Complex splitting was fragile with special characters
                // AFTER: Simple and reliable extraction of just the filename
                let urlParts = element.href.split('/');
                let filename = urlParts[urlParts.length - 1];
                songs.push(filename)
            }
        }

        // Show all songs in playlist
        let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
        songUL.innerHTML = ""
        for (const song of songs) {
            // IMPROVEMENT: Better URI decoding
            // BEFORE: <div>${song.replaceAll("%20", " ")}</div>
            // PROBLEM: Only replaced spaces, missed other encoded characters
            // AFTER: Properly decode ALL URI components for correct display
            let displayName = decodeURIComponent(song).replaceAll("%20", " ");
            
            songUL.innerHTML = songUL.innerHTML + `<li>
                <img class="invert" src="svgs/music.svg" alt="">
                <div class="info">
                    <div>${displayName}</div>
                    <div>Song Artist</div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img class="invert" src="svgs/play.svg" alt="">
                </div> </li>`;
        }

        // Attach event listeners to each song
        // IMPROVEMENT: Simplified selector
        // BEFORE: Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((e) => {
        // PROBLEM: Overly complex selector chain was fragile
        // AFTER: Cleaner, more reliable CSS selector
        Array.from(document.querySelectorAll(".songlist li")).forEach((e) => {
            e.addEventListener("click", () => {
                let songName = e.querySelector(".info div").textContent;
                playmusic(songName)
            })
        })

        return songs;
    } catch (error) {
        // ADDED: Comprehensive error handling
        console.error("Error fetching songs:", error);
        return [];
    }
}

const playmusic = (track, pause = false) => {
    try {
        // IMPROVEMENT: Proper URL encoding
        // BEFORE: currentsong.src = `/${currfolder}/` + track
        // PROBLEM: Direct concatenation created invalid URLs for special characters
        // AFTER: Proper encoding for URL safety
        let encodedTrack = encodeURIComponent(track);
        currentsong.src = `/${currfolder}/${encodedTrack}`
        
        if (!pause) {
            // ADDED: Error handling for browser restrictions
            currentsong.play().catch(e => {
                console.error("Playback error:", e);
            })
            play.src = "svgs/pause.svg"
        }
        
        // IMPROVEMENT: Better URI decoding for display
        // BEFORE: document.querySelector(".songinfo").innerHTML = decodeURI(track)
        // PROBLEM: decodeURI doesn't handle all encoded characters
        // AFTER: decodeURIComponent handles all percent-encoded characters
        document.querySelector(".songinfo").innerHTML = decodeURIComponent(track)
        document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
    } catch (error) {
        console.error("Error playing music:", error);
    }
}

async function displayalbums() {
    try {
        let a = await fetch("/songs/");
        
        // ADDED: Response validation
        if (!a.ok) {
            throw new Error(`Server returned ${a.status} ${a.statusText}`);
        }
        
        let response = await a.text();
        
        // ADDED: Empty response check
        if (!response) {
            console.error("Empty response when fetching albums");
            return;
        }
        
        let div = document.createElement("div")
        div.innerHTML = response
        let anchors = div.getElementsByTagName("a")
        let cardContainer = document.querySelector(".cardContainer")
        
        cardContainer.innerHTML = ""
        
        for (let i = 0; i < anchors.length; i++) {
            const e = anchors[i];
            
            if (e.href.includes("/songs/") && !e.href.endsWith("/songs/")) {
                // IMPROVEMENT: Simplified folder extraction
                // BEFORE: let folder = e.href.split("/").slice(-2)[0];
                // PROBLEM: Complex array manipulation was error-prone
                // AFTER: Clear, straightforward URL parsing
                let urlParts = e.href.split('/');
                let folder = urlParts[urlParts.length - 2];
                
                // ADDED: Skip parent directory
                if (folder === "songs") continue;
                
                try {
                    let infoResponse = await fetch(`/songs/${folder}/info.json`);
                    
                    // ADDED: Skip if no metadata file
                    if (!infoResponse.ok) continue;
                    
                    let responseData = await infoResponse.json();
                    
                    cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                        <div class="play">
                            <div class="play-button">
                                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="black">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                            </div>
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="${responseData.title}">
                        <h2>${responseData.title}</h2>
                        <p>${responseData.description}</p>
                    </div>`
                } catch (error) {
                    console.error(`Error loading album ${folder}:`, error);
                    continue;
                }
            }
        }
        
        // Add event listeners to cards
        Array.from(document.getElementsByClassName("card")).forEach(e => {
            e.addEventListener("click", async () => {
                let folder = e.dataset.folder;
                songs = await getSongs(`songs/${folder}`);
                
                // ADDED: Safety check for empty song lists
                if (songs.length > 0) {
                    playmusic(songs[0])
                }
            });
        });
    } catch (error) {
        console.error("Error displaying albums:", error);
    }
}

async function main() {
    try {
        // Load initial songs
        songs = await getSongs("songs/ncss")
        
        // ADDED: Safety check for empty song lists
        if (songs.length > 0) {
            playmusic(songs[0], true)
        } else {
            console.warn("No songs found in the default folder");
        }
        
        // Display albums
        await displayalbums()

        // Play/Pause button
        play.addEventListener("click", () => {
            if (currentsong.paused) {
                // ADDED: Error handling for browser restrictions
                currentsong.play().catch(e => console.error("Play error:", e));
                play.src = "svgs/pause.svg"
            } else {
                currentsong.pause()
                play.src = "svgs/play.svg"
            }
        })

        // Time update listener
        currentsong.addEventListener("timeupdate", () => {
            document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)} / ${formatTime(currentsong.duration)}`
            document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration * 100) + "%";
        })
        
        // Seekbar
        document.querySelector(".seekbar").addEventListener("click", e => {
            let percent = ((e.offsetX / e.target.getBoundingClientRect().width) * 100)
            document.querySelector(".circle").style.left = percent + "%"
            currentsong.currentTime = (currentsong.duration) * percent / 100;
        })
        
        // Hamburger menu
        document.querySelector(".hamburger").addEventListener("click", () => {
            document.querySelector(".left").style.left = "0%"
        })

        document.querySelector(".close").addEventListener("click", () => {
            document.querySelector(".left").style.left = "-120%"
        })

        // Previous button
        prev.addEventListener("click", () => {
            // ADDED: Safety check for empty song lists
            if (songs.length === 0) return;
            
            currentsong.pause()
            
            // IMPROVEMENT: Better current song identification
            // BEFORE: let index = songs.indexOf((currentsong.src).split("/").slice(-1)[0])
            // PROBLEM: Incorrect song identification caused navigation failures
            // AFTER: Reliable current song identification with proper decoding
            let currentSrc = currentsong.src;
            let urlParts = currentSrc.split('/');
            let currentSongName = urlParts[urlParts.length - 1];
            let index = songs.indexOf(decodeURIComponent(currentSongName));
            
            // ADDED: Fallback if song not found
            if (index === -1) index = 0;
            
            if ((index - 1) >= 0) {
                playmusic(songs[index - 1])
            }
        })

        // Next button
        next.addEventListener("click", () => {
            // ADDED: Safety check for empty song lists
            if (songs.length === 0) return;
            
            currentsong.pause()
            
            // IMPROVEMENT: Better current song identification
            let currentSrc = currentsong.src;
            let urlParts = currentSrc.split('/');
            let currentSongName = urlParts[urlParts.length - 1];
            let index = songs.indexOf(decodeURIComponent(currentSongName));
            
            // ADDED: Fallback if song not found
            if (index === -1) index = 0;
            
            if ((index + 1) < songs.length) {
                playmusic(songs[index + 1])
            }
        })

        // Volume control
        let volumeInput = document.querySelector(".range").getElementsByTagName("input")[0]
        volumeInput.addEventListener("change", (e) => {
            currentsong.volume = parseInt((e.target.value)) / 100;
            
            // IMPROVEMENT: Simplified volume icon management
            // BEFORE: Complex string replacement logic
            // PROBLEM: Fragile and hard to understand
            // AFTER: Direct, clear assignment of icon paths
            if (currentsong.volume > 0) {
                document.querySelector(".volume img").src = "svgs/volume.svg";
            } else {
                document.querySelector(".volume img").src = "svgs/mute.svg";
            }
        })

        // Volume mute toggle
        document.querySelector(".volume img").addEventListener("click", (e) => {
            if (currentsong.volume > 0) {
                currentsong.volume = 0;
                volumeInput.value = 0;
                e.target.src = "svgs/mute.svg";
            } else {
                currentsong.volume = 0.5;
                volumeInput.value = 50;
                e.target.src = "svgs/volume.svg";
            }
        })
    } catch (error) {
        console.error("Error in main function:", error);
    }
}

// Start the application
main()