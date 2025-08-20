console.log("checking that linked to the html file") //inspect > console to see this message go ; if it appears means our js file has been successfully been linked to the html file.

let songs; //made global after step229

// step165: we tell chatgpt to give us function to convert seconds that was being displayed in previous step on console , into minutes : seconds format like 01:12 --
function formatTime(seconds) {
    // step239: we instead of printing NaN on doing prev or next print 00:00 to look better there : this also asked and put the if condition from CHATGPT only.
    if(isNaN(seconds)||seconds<0){
        return "00:00"
    }
    let minutes = Math.floor(seconds / 60);        // Get whole minutes
    let secs = Math.floor(seconds % 60);           // Get remaining seconds

    // Pad with 0 if needed to make "01" instead of "1"
    let formattedMinutes = minutes.toString().padStart(2, "0");
    let formattedSeconds = secs.toString().padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
}


// step83: your songs is in "songs" folder : so on webpage we copy the link and paste /songs/ at end instead of index.html there : to get : http://127.0.0.1:3000/songs/ : here all songs and duration and all written.

// step86 : on seeing inspect > console : we know now await can be used inside async functions only -- so lets create them and un all these below inside it.
async function getSongs(){ //function to return all songs from the directory
    // step84: use fetch api for that link of songs
    let a =await fetch("http://127.0.0.1:3000/songs/"); //we wait for it to fetch the data from the link and after its resolved , "a" holds a response object from fetch request that made network request to the url stored.
    let response = await a.text(); //makes it extract text from the response object "a" and store raw text in "response"
    // console.log(response); //logs on inspect >console : the songs list in form of table we can see there.
    
    // step85: now we will parse the text we got and then we'll extract the song details from it.
    let div = document.createElement("div")
    div.innerHTML = response //storing the text we extracted in a created element "div"
    // step87 : we see we're getitng in form of table our songs data , where <td> has <A> in which song is inside<a> tags : so lets try to target them below and store all <a> in as variable here.
    let as = div.getElementsByTagName("a")
    // console.log(as)

    // step88 : now we want only those <a> in which "href" is there , as thats only what we are required with.
    let songs = [] //blank array to push all the songs "href" into it
    // traversing the <a> we got
    for(let i=0;i<as.length;i++){
        // we will get error if we do .endsWith in i.href.endsWith in the "if" statement below as they are index only : so lets access each <a> using those index and apply the endsWith on them.
        let element = as[i];
        if(element.href.endsWith(".mp3")){ //as we only concern about href links of songs that ends in ".mp3" as its audio file.
            //  songs.push(element.href) :we push all those <a> tag's href in the songs array in each iteration.

            // step103: after step102 : we see the songs are displayed as : http://127.0.0.1:3000/songs/10,000%20Reasons%20-%20Anthem%20Lights.mp3 : but we want to display just the song name and all : so we split it at "/songs/" to get array like ['http://127.0.0.1:3000', '10,000%20Reasons%20-%20Anthem%20Lights.mp3'] : we got this after doing the let s = "link" on console and then s.split("/songs/") we did there to verify what is coming : and so we want now the index 1 not 0, so lets push it now instead of pushing whole "href"like we did in step88 above here.
            songs.push(element.href.split("/songs/")[1])
        }
    }
    // console.log(songs) : by this we can see in inspect > console : all the ".mp3" songs in an array
    return songs; //step 89:return this as the function's aim was to return the songs from song directory that we had.
}

// step90: call the async function and test it
// let songs = getSongs()
// console.log(songs);
//step91: by doing the above wee see a promise pending in the console : its because its async function : so returns a promise-object : so we need to await for a promise always in order to resolve it & since we can only have await inside an aync function so lets make that too.

// step150: lets make it a global object now.
let currentsong = new Audio();

// step144: lets define the playmusic function now 

// step170: we introduce new argument named "paused = false" initially set to false : so that music remains pause dntil user interacts and clicks on play : because furher below in step171 , we have made the "if" statement that runs the song initially only when its condn becomes true but since we have passed "true" there , it becomes false in the condn and so not plays song upon reload : read from step168 and 169 first too : so what we have done is that : we have made by default that , if no argument is passed when calling this function , it gets set to "false" as : is helpful for cases where you usually want the song to play, but sometimes you want webpage to load without playing music , so we set it to be false only. (pause is just a variable passed here) : and later using event listener on step156 , we can toggle between play and pause buttons thereafter whenever needed further ahead : as there also we have set to play apuse the music when the play button is clicked and toggled there.

const playmusic = (track , pause=false) =>{
    // let audio = new Audio("/songs/" + track) //step145: this written as the song name passed as "track" contains only song name save din folder : but full path includes /songs/ telling folder name too : so we include that too.
    // step146: ensure to rename the song names in folder to simple form without mp3 written in it : as it automatically gets ".mp3" extension when downloaded : eg: on my way > renamed to > and automaticlally set as "on my way.mp3"
    // audio.play() //to call play the function now

    // step147: but a problem coming is that : when we click on multiple songs at once : all of them are playing together because a new audio object is being formed everytime we click on the new <li> listed there : so lets resolve it in next  step.

    // step151 : now lets put the source(src) of current_song to the source of the audio file passed as track here : same format used in step145 above.
    // step152: so we comment out the previous step 144 and 146 thing above : as now we want a common global object to be updated everytime instead of creating a new object for every song track and instead make it update the same variable everytime : so that only the update one gets played everytime.
    currentsong.src = "/songs/" + track
    // currentsong.play() : we commented this after step171 below and placed it inside the if statement below : as we don't want to play the song intially on reloading the webpage automatically , tabhi toh we passed true in step168 function call to play music ; as we want song to not play initially : and later when play button clicked again then event listener of step156 runs and toggles between play and pasue after that.

    // step171: now we had passed in function call true , so this "if" condn not becomes true and not runs : so the above line loads the song track in currentsong , but not plays it : and keeps the svg as play.svg only upon reload of website initially , since this if not ran and so src of play remains as play.svg only initially when webpage is reloaded there. 
    if(!pause){
        currentsong.play()
        play.src ="svgs/pause.svg" //step 172: step158 vala pause.svg commented out and placed inside this "if" as we don't want to show pause.svg when page is reloaded initially , but show play.svg which is there by default initially when webpage reloaded : and later we can toggle in between them in step156 where we defined the event listeners for clicking those buttons of playbar.
    }
    // step158: we display pause when a song begins to play on clicking play now in <li> here.
    // play.src ="pause.svg"
    
    // step159: we now decide what to display in song name and duration , when a song is playing.
    document.querySelector(".songinfo").innerHTML = decodeURI(track) //we dispaly track name here
    // step173: we used "decodeURI" as the track name was being displayed with %20 and all too-
    /*In a URL, spaces are not allowed. So:

     A space (" ") becomes %20

     A comma (,) becomes %2C

     A (:) colon : becomes %3A

     And so on...

     What does decodeURI() do?
     It reverses this encoding — it converts %20 back to a space, etc.*/

    document.querySelector(".songtime").innerHTML = "00:00 / 00:00" //lets set it to 00:00 / 00:00 by default here initially : in order to design it more better now using css first.
}

async function main(){

    // step134: variable made for the current song to be played.
    // step148: lets update this currentsong object only now , instead of creating new object for each click as it plays all of them together too.
    // step149 : comment this out and make as a global object instead.
    // let currentsong = new Audio();

    // gets list of all songs
    // step229: made songs global variable in next step above so remove let from below and put there : so that it can be used throughout thr function now : and make sure to keep it at topmost of this .js file as songs was used in getsongs function now ; so make it global before all these functions for safety purpose.
    songs = await getSongs();
    // console.log(songs);

    // step168: now we want that a default song to be set on the playbar when we reload the webpage , so that on clicking playbar , the song can be played there directly , instead of going in left section's playlist and clicking on the song specifically. 
    playmusic(songs[0] , true) //step 169: we by default when page is reloade , we set the 0th index song to play by default from songs list & also we set its pause to "true" : so we will have to set an argument named paused ="false" there too : to keep paused as false initially telling that music is paused initially and plays when user interacts there only.

    // now trying to show all the songs in the playlist
    // step93: now we search on google > "how to play audio in js" > get code from stackoverflow and use here below.
    // step124 : lets comment out this var audio and play part as now we don't want to play just the 1st song here at [0] : 0th index
    // var audio = new Audio(songs[0]);
    // audio.play(); //error comes as user didn't interact with the document , so can't use play() function. 

    // step94 : we again saw on stack overflow to see the duration and all like this : this fires this function only once and just as data of song is loaded it plays it like if we mention songs[1] and press ctrl+s it will play once and on reloading of page stops : thus first only once when data of song gets loaded.
    // audio.addEventListener("loadeddata",() =>{
    //     let duration = audio.duration
    //     console.log(duration) //prints the total duration in seconds on inspect > console
    // })
    // step95: but we dont want it to play only once when song's data gets loaded but play everytime user wants : so for that we again explore "stack overflow" and come to know that : audio element is formed by inheriting "HTMlMediaElement" : so lets use it and print other things too in console.log() inherited form that HTMLMediaElement : that we studied from "stackOverflow" .

    // step125: after step124 lets comment this also out for now
    // audio.addEventListener("loadeddata",()=>{
    //     let duration = audio.duration;
    //     console.log(audio.duration , audio.currentSrc , audio.currentTime) //displays now the source media file and its duration of playback of song too : initially 0 as song has not been played yet.
    // })
    // step100: lets now try to put whatever songs is there in the <ul> of songlist class
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    // step102: console.log(songUL) : we can do this just to see why without [0] it was not being displayed ; actually its an html collection returned , so to sleect ul its at 0th index in it we put [0] in the above code line
    // in arrays we use for-of loops always to access elements : so lets use it.
    for (const song of songs) {
            // step101: songUL.innerHTML = songUL.innerHTML + song : to append each song in the HTML content of the <ul> we selected inside "songUL"
            // step102: we now add the song using template literal iof backticks ` ` ; we place song inside <li> , so that : the css of <li> to numbe rit can be applied on it.
            // songUL.innerHTML = songUL.innerHTML + `<li>${song}</li>` 

            // step104: we dont want %20 and all to come so we replace all %20 by spaces here.
            // songUL.innerHTML = songUL.innerHTML + `<li>${song.replaceAll("%20" ," ")}</li>`

            /* step135: we now commented out content of <ul> from html file and use it here instead so that later the song name and artist can be put by us as we want based on the different songs added in the playlist. */
            // so here we replaced the content inside <li> that we had there to the <li></li> we had here and replace the "song name" that was there to the thing we defined here i.e. : ${song.replaceAll("%20" ," ")}
            songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="svgs/music.svg" alt="">
                                <div class="info">
                                    <div>${song.replaceAll("%20" ," ")}</div>
                                    <div>Song Artist</div>
                                </div>
                                <div class="playnow">
                                    <span>Play Now</span>
                                    <img class="invert" src="svgs/play.svg" alt="">
                                </div> </li>`;

    }


    // step136: now after we had shown all songs in playlist by above loop : we now attach an event listener to each song.
    // step137: we target all the <li> present inside the ".songlist" class and then convert it into array using "Array.from" and then we have an element "e" in it : which represents each element "e" in the resulting selected target element : we have targetted all <li> in .songlist > so this will have "e" as each <li> selected and stored in the created array using "Array.from" here.
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((e)=>{
        // console.log(e); : can be done to see that all <li> got printed as "e" targetted all <li> of ".songlist" as per the for loop used.
        // step138: now we want to play the song written in that <li> to play when user clicks on it.

        // step139:
        // console.log(e.getElementsByTagName("div")) : this on inspect > console gave all html collections containing all the "div" present inside all the <li> that we had targetted.

        // step140:
        // console.log(e.getElementsByTagName("div")[0]) //we now target the 0th index in each to get the "info" class vala "div" containing the song info.

        // step141: document.querySeelector : searches for the first element having info class ; but e.queryselector searches for the first element having info class inside e which was <li> as per the loop we saw above.
        // console.log(e.querySelector(".info")) : this targets and prints all the data inside .info class inside the <li>

        // step142: 
        // console.log(e.querySelector(".info").firstElementChild.innerHTML) // now : this selects the first element of it first i.e. the <div> containing song name and all & then we just want the data in it so done using innerHTML.

        // step143: now when user clicks on a particular song out of these : it should play
        e.addEventListener("click" , element=>{ //we tell that when clicked on <li> as "e" wa s<li> seen above in the for loop
            console.log(e.querySelector(".info").firstElementChild.innerHTML) //on clicking on a song now it displays the song name on console too firts , like we did using the step142 line.
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim()) //then it should play this particular music ; using the playmusic function
            // we used "trim" function to remove any extra whitespaces to cause any error in finding the file in next step.
        })

    })
    // step155: we now attach event listeners to prev,play and next buttons of playbar
    // step156: for play button , we want that when someone click on it ; if song playing it should pause and icon changed too to paused and vice-versa.

    // let play = document.getElementById("play"); : this line can be ignored too : as we had made "play" as id of play button ; so can be used directly too as below like "play. : and that play become sglobal variable by default so can be used in step158 outside too as its global.
    play.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play()
            play.src="svgs/pause.svg"
        }
        else{
            currentsong.pause()
            play.src="svgs/play.svg"
        }
        // step157: but a problem is coming that when we click on the list on left ; it plays even with play button still there : but usually when we click play now ; a pause button should come there na : so lets do it in next step.
    })

    // step163: we now listen to update the songtime in the playbar as the song continues to play.
    // so we put the event listener on the song being played "currentsong" , so that : we can do listening of events and updation of duration fo song played , based on that current song being played.
    currentsong.addEventListener("timeupdate",()=>{
        // print these as the current song's time gets updated
        //step164: 
        // console.log(currentsong.currentTime , currentsong.duration) : on doing so we can see the time played , total time of duration : in the console being updated as the currentsong is being played as we had used event-listener on an audio object "currentsong" which does so.

        // step166: we now update the innerHTML of songtime to display this in duration now.
        document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)} / ${formatTime(currentsong.duration)}`
        // step167: so we have above : set the innerHTML of duration to the currentTime in 00:12 format and same for duration after putting "/" there : all done by the function chatgpt gave us to fromat the time earlier : so we prefer using ${} inside ` ` backticks in these cases when we want variables to be displayed or function's values to be displayed there later.

        // step174: we now want the seekbar's circle to move too as the song is playing , so lets add this seekbar updation inside evenlistener of currentsong only as we want to make it move with flow of the currentsong currently playing only : so we do as follows--
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration * 100) + "%";
        // step175: the above line makes the circle's left to keep on increasing in terms of % that was 0% initially in css of that circle of seekbar : and we increase it based on the % of song played ; as we saw earlier how the time and duration of song was increasing here earliwe in step164 and all ..so its left will keep increasing based on amount of song played in % like if 30 / 120 is there it does 30/120 = 0.25 *100 = 25% ; so left becomes 25% and so on .. it keeps on increasing uptill 100% when both time played and duration becomes equal there : thus reaches the end of seekbar and stops finally when song ends and right becomes 100% and stops the circle too at rightmost end of seekbar there.

        // step176: now lets try to make the circle to be able to be seeked to a particular place on seekbar wherever needed : so lets put an event listener on the seekbar now.
        document.querySelector(".seekbar").addEventListener("click" , e=>{
            // console.log(e) > step177: we did this to understand what all coming when clicked on seekbar
            // step178: from inspect > console after above step got printed , we clicked on (>) there in eany console line printed upon clicking on the crossbar and thus we see lot of its properties out of whihc we are interested in its x-axis distance / offset only 

            // step179: so we print the targetted element i.e. the seekbar and its x-offset on console now --

            // console.log(e.target , e.offsetX) 
            // step180: so now it prints both the element targetted and the offset in x-axis fo it wherever we click after playing on the seekbar > we can see them on console > atstart its 0 ant end its ome more value , in between some other value & so on.... thus the more far we click on the seekbar from the start , more the offset / distance comes there.

            // step181 : now lets print one more element here below --
            // console.log(e.target.getBoundingClientRect(), e.offsetX)
            // step182: now it prints on inspect > console : it tells where we are on the current webpage : so it prints the x,y ,width and all where we are clicking at.

            // step183: now we print the width of the seekbar as we have the element e.target as seekbar that is being targetted here : can verify by just printing e.target and see that we are targetting the seekbar in this event listener here & then we get total width of it using getboundingclientrect() on the viewport of current device size, like if we decrease screen size and then see width on console : it will be printing the total width of the seekbar based on the current device screen: so here below we are getting bu offsetX that where we clicked from start of seekbar & getbounding... tells the total width we could have clicken in this range : so we try to get the % of total width we clicked at by dividing them and * 100 below

            // step184: so we used the ".width" property from the various properties being displayed by this getbounding function and then proceed further.

            // console.log((e.offsetX / e.target.getBoundingClientRect().width)* 100) //step185: So, we put "* 100" inside console log bracket else won't take it in consideration when logging the % : so by this we can see the % in seekbar where we clicked at out of its total width.

            // step186: now based on the % we got stored now in "percent" variable : we change the % of left property of circle to that directly and thus circle comes there when clicked directly.
            let percent = ((e.offsetX / e.target.getBoundingClientRect().width)* 100)
            document.querySelector(".circle").style.left =  percent + "%" //to update left of circle to this much % where we clicked in terms of % like it was at 0% initially before being played.

            // step187: now on clicking there , seekbar is moving but what if we want to change the duration also to that duration where we seeked at.
            currentsong.currentTime = (currentsong.duration) * percent/100; 
            //like if song duration is 200sec : user clicked at 75% of seekbar width calculated in percent ; then we must make the currentTime of song to shift to / get updated to that new time : 200*75/100 i.e. 75% of 200 = 150 : so shifted to/updated to 150 seconds and plays from there now.
        })
    })

    // step200: we now add event listener to the hamburger icon : so that the left section comes out visible when we click on its icon.
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0%" //make the left come from -100% that it had to 0% when clicked on the hamburger icon there.
    })

    // step206: add event listener for the close button now.
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-120%" //same as the hamburger button , we now have for this ".close" here to set it back to -100% which it was initially.
        // step207: but we see that in iphone12pro and all , the cross and some part of left is still visible : so it means we need to send it more on the left side when closed.
        // step208: so we make -120% instead here and also in .left replace the -100% by -120%
    })

    // step227: we now create event listeners for previous and next buttons made there : and as done for play , since prev and next also are id's so we can use them directly too and also can do let prev = getelementbyid("prev") and then use : both works as long as its "id" we are talking about.
    prev.addEventListener("click",()=>{
        // console.log(currentsong) //prints the currentsong's that has been loaded in the data and wa slast played/paused : present on the playbar.
        // console.log(currentsong.src) //prints the currentsong's src : source link : that was last played/paused : present on the playbar.
        // console.log(songs)
        // step228: we now make the songs variable in the next step as global variable so it can be used here too , to see the list of songs.

        // step230: lets print and see all the songs list now.
        // console.log(songs)

        // step231: we now want to search the current song's .mp3 part like : this part we want "10,000%20Reasons%20-%20Anthem%20Lights.mp3" from the total : "http://127.0.0.1:3000/songs/10,000%20Reasons%20-%20Anthem%20Lights.mp3" that we got by currentsong.src above in the commnets here.
        // step232: Clearly we see that we need to split it based on "/" and make an array like below--
        // console.log((currentsong.src).split("/"))
        // step233: then the last index contains the .mp3 thing : so access it using slice(-1) and since it now returns an array with only the element containing .mp3 text , so we access and convert it from array to text by accessing its text at 0th index i.e. itself : so we did [0] too here.
        // console.log((currentsong.src).split("/").slice(-1)[0])

        // step234: now we want to search this song we got in the songs list we have : so we need to find its index in the songs array containing all the songs : so we find its index in songs array now and print and see it to verify that it is the index of the current song playing on the playbar.

        // step240: currentsong made pause also when clicked so that it doesn't overlap with the prev or next songs
        currentsong.pause()

        let index = songs.indexOf((currentsong.src).split("/").slice(-1)[0])
        // console.log(index)
        
        // step235: now lets write what to do on clicking on this prev button.
        // step236: so we have to play the song on currentsong's index (-1) song on clicking on previous and also we must ensure that do this only if that index is >=0 as index can't be -ve by rule.
        if((index-1)>=0){
            playmusic(songs[index-1])
        }
    })
    // step237: same done for next button now.
    next.addEventListener("click",()=>{
        let index = songs.indexOf((currentsong.src).split("/").slice(-1)[0])
        // step238: we now check that index+1 should not be >=length as index is 0 based so its last is till length-1 : so play only till then , else next button doesn't work : we do it here.

        // step241: currentsong made pause also when clicked so that it doesn't overlap with the prev or next songs
        currentsong.pause()

        if((index+1) < songs.length){
            playmusic(songs[index+1])
        }
    })

    // step253: now we add event listener for the volume seekbar : that was in the div.range class and was the <input> tag actually that brought that seekbar of volume.
    // step254: if we don't put [0] it wont work as if we do console.log(document.querySelector(".range").getElementsByTagName("input")) : we see that it returns html collection containing : input at 0th index and volume : input which is not needed ; maybe browser named and added that ; so we need 0th index only : so putting [0] is must there.
    // step255: we add event listener for "change" i.e. when the input is changed i.e. the seekbar which is the input itself is changed : then do the mentioned functionalities.
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change" , (e)=>{
        // step256: console.log(e)// always do this to check if the event is working or not correctly on changing the volume seekbar there : and printing something on the console there.
        // step257: console.log(e.target) //prints the input tag that we targetted here using the element object "e"
        // step258: console.log(e.target.value) //prints the value we have seeked the input seekbar here : like when seeked at start : its 0 ; when seeked till end its 100 ; and so on....
        // step259: we google to know that "how to set music volume in audio tag in js" & get this --
        /*// Set audio volume to 20%
            document.getElementById("myAudio").volume = 0.2;
            so : the value can be from 0 to 1 representing 0% to 100% volume there.
        */
        // step260: set the volume using above syntax to the currentsong being played that was stored always in the "currentsong" variable seen earlier.
        //step261:  must parse it to int as e.target.value is actually a string : any console logged is usually a string only whether it be number or decimal usually in js console logs.
        // step262: and it gives value from 0 to 100 saw earlier , but by syntax the value can be 0 to 1 only so "divide by 100" too here.
        currentsong.volume = parseInt((e.target.value)) / 100;

    })
    

}

main() //step92 : call the function now : to show all array of songlist on inspect > console now.




