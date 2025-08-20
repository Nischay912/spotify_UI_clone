// step270: now this file is continuation to the previous script file comments : it would be crowded comments there ; so we make a new file for upcoming steps now.

console.log("checking that linked to the html file")

let songs;
let currentsong = new Audio();
// step275: lets make a currentfolder file too like currentsong : to be used in the playmusic() function.
let currfolder;

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

// step271: we were using songs folder to get songs : so why not pass the "folder" instead in the function to extract songs from it now whatever folder name is passed inside as argument here.
async function getSongs(folder) {

    // step276: so now we update current folder to folder sent as argument as soon as getsongs is called here and everywhere ${currentfolder} done instead of {folder} that we did earlier.
    currfolder = folder;

    // step272: so now ` ` backtick used as $ can be used inside that only : and $ used to access the variable folder's value and place instead of /songs/ to /folder/ now passed as argument to/in this function here.
    let a = await fetch(`http://127.0.0.1:3000/${currfolder}/`);
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    // step299: we had made songs global variable earlier ; so no need to put let and declare again here : may cause ambiguity ; let the songs declared globally be a common place every function accesses throught our code here.
    // let songs = []
    songs =[]

    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            // step273: here also /songs/ replaced by folder's value and backticks used as $ used to access variable's name can be used when placed insid ebackticks ` ` only.
            songs.push(element.href.split(`/${currfolder}/`)[1])
        }
    }

    // step295: added as per the step294 said to do so.
    // show all songs in playlist
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML=""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="svgs/music.svg" alt="">
            <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>
                <div>Song Artist</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="svgs/play.svg" alt="">
            </div> </li>`;
    }

    // // step296: this also added as per the step294 said to do so.
    // attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((e) => {
        e.addEventListener("click", element => {
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    // step298: no more need to return songs now as in step297 we removed songs = await .... : so where will it return this into , now its not storing anything just waiting by await : so no need of return statement here now : so we commented the below line.
    // return songs;

    // step357: getsongs function was not returning anything till now that's why the last step didn't work.
    return songs; // ✅ Important: without this, songs = await getSongs(...) becomes undefined as it doesn't return any value to be inputted into songs = there on the left hand side there , so next/prev won't work if its not here.
}

const playmusic = (track, pause = false) => {
    // step274: here also replaced /songs/ to /folder/
    currentsong.src = `/${currfolder}/` + track
    if (!pause) {
        currentsong.play()
        play.src = "svgs/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

// step302: lets define the fucntion now.
async function displayalbums(){
    // step303: we'll try to modify the code we used to fetch songs in getsongs() function only , so that work becomes similar and easier ; so we try to modify this code we used in getsongs() there -- 
    // let a = await fetch(`http://127.0.0.1:3000/${currfolder}/`);
    // let response = await a.text();
    // let div = document.createElement("div")
    // div.innerHTML = response

    // step304: we use same code of getsongs to fetch , but now we have to fetch "songs" directly to access the various album folders inside it: so write "/songs/" now.
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response

    // step305: now lets display the div to see what all is inside "div" here
    //  console.log(div) //: we see that there are 4 tr in table ; inside the 4th tr we have a td in which there is <a href ..> with /songs/ncs/ in "href" there.
    //NOTE THAT : these "cs" "ncs" are folders in the /songs/ folder : will be renamed once the project is complete so dont be confused at that time where did they go..

    // step306: so now lets access the href containing /songs/ there as it is follwed by the album name "cs" there
    let anchors = div.getElementsByTagName("a") 
    // console.log(anchors) //we see 3 anchors we get on inspect > console : that are there in the div above.
    
    // step307: now we want that href that contains "/songs/"
    // step308: must convert to array using Array.from as : for-each loop can be applied on arrays only and we always get HTML collection by default on inspect > console usually.

    // STEP331: the error was coming in last step because : Because forEach does not work well with async/await — especially when you want to await inside a loop and control the order of execution : but in normal for loop : Each iteration waits for the previous one to finish : await only needs to be inside an async function, not inside an `async loop.
    // The traditional for loop runs synchronously, one iteration at a time.
    // If each iteration uses await, it will wait for the async operation to finish before moving to the next iteration : so : await works inside, but the loop does NOT wait : so using traditional for loop is better as : Each iteration waits for the previous one to finish in it : & also no need to worry that how will await work inside , if we remove the for each that had async : so understand this that : await only needs to be inside an async function, not inside an `async loop : so since the overall "display albums" function was async so : we can have await inside traditional loop ; as the overall function is async only : so await can work properly inside of it.

    // step332: so the for-each loop that we were using is commented out now.
    // Array.from(anchors).forEach(async e=>{
        // step309: this can be done to see all the href there on console.
        // console.log(e.href)

        // step333: lets replace it by a traditional for loop as follows--
        // step334: the array.from being used earlier saved as an array in "arr" array variable here : which in next step used in the traditional for loop there.
        let arr = Array.from(anchors);

        // step335: now run traditional for loop on the "arr" array
        for (let index = 0; index < arr.length; index++) {
            // step336: the "e" being used there to store each element in the for loop's iteration : now that stored like this index by index in "e" variable here.
            const e = arr[index];             

        // step310: now we tried to access href containing /songs/ in it : and the function to do so is ".includes" in javascript. 
        if(e.href.includes("/songs")){
             //step311: we can now see the href with /songs in it
            // console.log(e.href)

            // step312: this done to split it in arrays 
            // console.log(e.href.split("/"))

            // step313: and then we see that folder cs ,ncs are at 2nd index from end : so use slice(-2) and we now on console see an array with last 2 elements of previous array
            // console.log(e.href.split("/").slice(-2))

            //NOTE THAT : these "cs" "ncs" are folders in the /songs/ folder : will be renamed once the project is complete so dont be confused at that time where did they go..

            // step314: now we want its 0th index text for the folder name : so put [0] now here : to get all the folder's name now here.
            // console.log(e.href.split("/").slice(-2)[0]) : //we now got the name of all folders in/of "anchors"

            // step315: see the "dynamic.txt" file now

            // step316:now we store the folders we got in step314 here.
            let folder = e.href.split("/").slice(-2)[0];

            // step317: we now get the metadata we stored in the ".json" file now for each of these folders that we had earlier.
            // step318: we do that using the fetch again that we did in step304.
            // step319: we now since used "await" below , we must make the "async" function to the forEach loop there in step308 : as await can be used inside "async" function only.
            // step322: we now have to fetch the folder we got above in step316 & then the "info.json" present inside it.
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
            // step320: we now don't have ".text" , but ".json" file : so replaced it from .text to .json below.
            let response = await a.json();
            // step321: we now print this on console to see if the object is getting accessed and printed or not here.
            console.log(response)
            // step323: now we need to populate the card-container by the "title" and "description" we got from the response here.
            // step324: we target the cardcontainer class now here in which we have to add all the card albums dynamically based on folder names now.
            let cardContainer = document.querySelector(".cardContainer")
            // step325: so now we update the innerhtml of cardContainer by that : we copy the  <div class="card" we had in html for a card : and append it by doing "+" to the current innerHTML of the cardcontainer below.
            // step326: we add the title and description we got from the response variable above in the <h2> and<p> below.
            // step327: after that we set the image also to cover.jpg that we have made in each "folder" inside songs folder : so that written as the path inside <img> tag below.

            // step356: we need to have `<div data-folder = "cs" replaced by `div data-folder="${folder}" : else it will load only the "cs" folder's songs in it : but we want it to load songs based on folder name sent as argument here ; so lets do so below.
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
              <div class="play">
                <div class="play-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="black">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              <img src="/songs/${folder}/cover.jpg" alt="">
              <h2>${response.title}</h2>
              <p>${response.description}</p>
            </div>`
            // step328: now we see that the title , image and description to the card got set and due to "+" the two cards got appended along with the current cards there too.
            // step329: but we see that now the event listener that was listing the songs on left section present inside that folder : ITS NOT WORKING NOW : lets resolve it in the next step.
            // step330: we try to bring the code that was adding the songs list on clicking the card on left section here and comment it out from the main function : BUT STILL ITS NOT WORKING AND NOT DISPLAYING LIST OF SONGS ON LEFT SECTION WHEN CARD IS CLICKED : lets resolve it in the next step now.

            Array.from(document.getElementsByClassName("card")).forEach(e => {
                e.addEventListener("click", async (item) => {
                songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
                // step356: we want now that on clicking on any card its playlist's first song at 0th ondex [0] : starts playing.
                playmusic(songs[0])
                });
            });

        }
    // step337: finally close the for loop we made at end here
    }
    // step338: now the songs are being listed on clicking on cards now : so the problem was that we were doing everything asynchronously in async for each loop : but we want them to happen one after the other , not waiting for anyone : in order for event listeners to work correctly : so async for each loop replaced by a traditional for loop now here.   
    
}

async function main() {
    // step277: pass the folder name now in the getsongs function whenever called now.
    // step297: we had below code "songs = await getSongs("songs/ncs");" : because before step295 : it was necessary to show song list and adding click features : all was done inside main : so it was necessary to fetch the list of songs from getsongs and return the array of songs there in getsongs by doing : "return songs;" there ; BUT NOW : we have shifted the code for showing all songs in playlist and attaching event listeners to each <li> in playlist inside the getsongs() itself : so why do we even have to return the songs and send in this main() : not needed now : so thats why we remove "songs =" from below and in next step remove "return songs ;" from getsongs too there as now not needed to return and store in songs variable as everything is done in getsongs only directly now.
    // songs = await getSongs("songs/ncs");
    await getSongs("songs/ncs")
    //NOTE THAT : these "cs" "ncs" are folders in the /songs/ folder : will be renamed once the project is complete so dont be confused at that time where did they go..

    playmusic(songs[0], true)

    // step300: now we write a code to dynamically display albums in the playlist automatically when we add folders like "cs" "ncs" in the songs folder.....
    // step301: so we'll populate the cardContainer now by this function.
    displayalbums()

    //NOTE THAT : these "cs" "ncs" are folders in the /songs/ folder : will be renamed once the project is complete so dont be confused at that time where did they go..

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "svgs/pause.svg"
        } else {
            currentsong.pause()
            play.src = "svgs/play.svg"
        }
    })

    // commented out as told to do so and shift to getsongs : told in step294.

    // // show all songs in playlist
    // let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    // for (const song of songs) {
    //     songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="music.svg" alt="">
    //         <div class="info">
    //             <div>${song.replaceAll("%20", " ")}</div>
    //             <div>Song Artist</div>
    //         </div>
    //         <div class="playnow">
    //             <span>Play Now</span>
    //             <img class="invert" src="play.svg" alt="">
    //         </div> </li>`;
    // }

    // // attach an event listener to each song
    // Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((e) => {
    //     e.addEventListener("click", element => {
    //         playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    //     })
    // })

    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)} / ${formatTime(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration * 100) + "%";
    })
    document.querySelector(".seekbar").addEventListener("click", e => {
            let percent = ((e.offsetX / e.target.getBoundingClientRect().width) * 100)
            document.querySelector(".circle").style.left = percent + "%"
            currentsong.currentTime = (currentsong.duration) * percent / 100;
    })
    

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0%"
    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    prev.addEventListener("click", () => {
        currentsong.pause()
        let index = songs.indexOf((currentsong.src).split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playmusic(songs[index - 1])
        }
    })

    next.addEventListener("click", () => {
        currentsong.pause()
        let index = songs.indexOf((currentsong.src).split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1])
        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentsong.volume = parseInt((e.target.value)) / 100;
        // step367: we saw a "BUG" that when we clicked on "mute" icon and increased seekbar , its value increased and music began to play , but the mute icon didn't change back to normal volume.svg.
        if(currentsong.volume>0){
            // step368: so we made the src of img inside .volume to be replaced by volume.svg from mute.svg whenever volume's value is >0 throughout : that's why we wrote that here only , so that : when the volume was being given value and event was being assigned , ussi vaqt do this so that whenever due to any user's action , seekbar made to increase the volume , mute shouldn't be there
            document.querySelector(".volume > img").src = document.querySelector(".volume > img").src.replace("mute.svg" , "volume.svg")
        }
        // step369: to set the volume.svg to mute.svg in same way as done above when : volume made =0 to set the volume icon to mut.svg by itself : showing that its mute now.
        else if(currentsong.volume==0){
            document.querySelector(".volume > img").src = document.querySelector(".volume > img").src.replace("volume.svg" , "mute.svg")
        }
    })

    // step278: we want to load the library/playlist as soon as someone cliks on the card in the spotify playlist there.
    // step280: we want to apply event listener on each card we have i.e. all elements having card class i.e. for all cards we want to apply event listener to do that on all the cards i.e. clicking on any card does that ; so apply it on all the cards for this/that to happen.
    // step283: must make it array using array.from as its html collection always by default and "for-each" loop can be applied on arrays only.

    // step331: COMMENTED OUT AND SHIFTED INSIDE DISPLAYALBUMS FUNCTION AS TOLD IN LAST STEP : STEP330 there.

    // Array.from(document.getElementsByClassName("card")).forEach(e => {
    //     // console.log(e) : to get all targetted elements printed on console i.e. all cards that have been targetted here will be printed now on the console.
    //     // step282: made this async as await works insid easync functions only always.
    //     e.addEventListener("click" , async (item)=>{
    //         // step281: we copied the same code we had above wehre we called getsongs function like this --
    //         // songs = await getSongs("songs/ncs")
    //         // step284: ".dataset" gives you access to all attributes that start with "data-" : i.e. to access all the data-attributes : and we had data-folder : so -folder accessed using .dataset.folder here in "item.dataset.folder"
    //         // step285: step281 and 284 combined code now to get folder name from datset data attributes now as follows--
    //         // songs = await getSongs(`songs/${item.dataset.folder}`)
    //         // so now instead of folder name inside songs we use the dat-attribute property given directly here now.

    //         // step286: nothing still happening by above codes : so we go on inspect.console > so lets print on console the item on which the event listener has to be applied first : so now on clicking on the card : it should give that clicked cards as we had targetted all cards here to apply event listener on all of them.
    //         // console.log(item);
    //         // step287: this printed to check , then did chatgpt to get that item is not an html element , so must do item.target in order to get the html element to be targetted.
    //         // console.log(item.dataset) 

    //         // step288: so after 287th step we do this now on the step285 and reuse it again now--
    //         // songs = await getSongs(`songs/${item.target.dataset.folder}`)

    //         // step289: by above step still error coming because if we print now that --
    //         // console.log(item.target)

    //         // step290: so now on  inspect > console we see that if we click on card's image : image link is being logged and on clicking the text , its being logged there > and on clicking the card portion on sides only > then only this <card> is being targetted and printed on the console.

    //         // step291: so we use currentTarget instead of target : as .target logs the element we click on : but currentTarget logs the element <card> on which the "click" event was applied on.

    //         // step292: so we rewrite the code with .currentTarget now instead of just .target .
    //         songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`) 

    //         // step293: but still that folder's files are not being loaded in the left section on clicking on that card here : because we are running getsongs function on clicking on them here : but a problem in that funciton is that : we don't have code to populate the songs list written in it : like we wrote the code for showing all songs in playlist , and addding event listeners to various things was also in main() , now in getsongs().

    //         // step294: so we cut the code of show all songs from playlist & attaching event listener to each song : from main() and take it inside getsongs() funciton.

    //     })
    // });

    // step340: now we want to add event listener to make the volume get muted when clicked on its svg.
    // step341: so lets make it mute when clicked on the volumme img there : present as direct child in the .volume class
    document.querySelector(".volume>img").addEventListener("click",(e)=>{
        // step342: lets check if clicking on it works or not by logging on console.
        // console.log(e.target) //gives us the <img> which we have targetted above using query selector above.
        // step343: lets see what the complete src is of it --
        // console.log(e.target.src) //we get : http://127.0.0.1:3000/volume.svg
        // step344: we see "volume.svg" inside src in the e.target : we want to make its volume.svg part to "mute.svg" when clicked on it and vice-versa.
        if(e.target.src.includes("svgs/volume.svg")){
            // step346: below line not replace still to mute.svg : because src was a string and strings are IMMUTABLE : so the below statement returns a new string and not chnages the original one.
            // e.target.src.replace("volume.svg","mute.svg")
            // step347: so we assign the new string returned to the original src in order to do so using "=" below.
            e.target.src = e.target.src.replace("svgs/volume.svg","svgs/mute.svg")
            currentsong.volume = 0; //we make the volume as 0 when clicked to get the "mute" icon here.
            //step350: we now want to also make seekbar of volume that we had earlier its value to become 0 too showing volume has become 0 on muting.

            // step352: we had the below line in seekbar's event listener , so we check by logging on console first that its .value giving us value fo seekbar position or not
            // console.log(document.querySelector(".range").getElementsByTagName("input")[0].value)

            // step353: since its logging the seekbar's location value above : we now set it to the required value when muted.
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;

        }
        
        // step348: same done below here also now in vice-versa case under "else" here.
        else{
            //step349: as we want to set volume to 10 on unmuting back , but volume takes values 0 to 1 only so 10 means 0.1 here.
            currentsong.volume=0.1; 
            e.target.src = e.target.src.replace("svgs/mute.svg","svgs/volume.svg")
            //step351: we now want to also make seekbar of volume that we had earlier its value to become 10 too , showing volume has become 10 on un-muting.

            // step354: same as step353 step : done here too now.
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })

}

main()
