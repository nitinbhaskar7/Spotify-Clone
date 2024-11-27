// document.body.querySelector(".card img:first-child").onpointerover =  () => {
//     document.querySelector(".playbutton").classList.add("playbuttonActive")
// };

console.log("Code is Running...");
let currFolder  = "Jailer";
let folderArtist  ;

const toMinutes = (time) => {
    if (isNaN(time)) {
        return "0:00";
    }
    let min = 0;
    let s = 0;
    min = parseInt(time / 60);
    s = parseInt(time % 60);
    if (s < 10) {
        s = "0" + s;
    }
    return min + ":" + s;
}

async function getFolders () {
    let songs = await fetch("http://nitinbhaskar7.github.io//items/songs/");
    songs = await songs.text();
    let dummy = document.createElement("div");
    dummy.innerHTML = songs;
    console.log(songs);
    let folders = []
    let anchors = Array.from(dummy.getElementsByTagName("a"));
    console.log(anchors)
    anchors.forEach(element => {
        console.log(element.getAttribute("href"))
        if (element.href.includes(`songs`)) {
            folders.push(element.getAttribute("href"));
        }
    });
    console.log(folders);
    console.log(folders[0].split("songs/").slice(-1)[0].slice(0,-1))
    folders.forEach(async (path) => {
        let folder = await fetch("http://nitinbhaskar7.github.io///"+ path + "desc.json");
        let descr = await folder.json() ;
        let cover = "http://nitinbhaskar7.github.io///" + path + "cover.jpg"
        // console.log(descr)
        document.querySelector(".playlistcont").insertAdjacentHTML("beforeend" , `
            <div class="card rounded" data-folder = "${descr.name}" >
                    <div class="imagecont rounded">
                        <img src="${cover}"  class="rounded"
                            width="200" alt="">
                        <img src="items/play.svg" class="playbutton " width="30">
                    </div>
                    <div class="text">

                        <h3>    
                            ${descr.name}
                        </h3>
                        <p>
                            ${descr.desc}
                        </p>
                    </div> 
                </div>
            `)
            
    });
    
}
let lis;

let currSong = new Audio(); // learning 
let currSongno = 0;
async function getSongs() {
    console.log("Curr Folder  :  "  + currFolder) 
    let f = await fetch(`http://nitinbhaskar7.github.io//items/songs/${currFolder}`);
    
    f = await f.text();
    console.log(f)
    console.log(typeof f)
    // convert the text into html 
    let dummy = document.createElement("div");
    dummy.innerHTML = f;
    let as = dummy.getElementsByTagName("a");
    console.log(as)
    let songs = []
    let desc ;
    for (const a of as) {
        if (a.href.endsWith(".mp3")) {
            songs.push(a.href);
        }
        if(a.href.endsWith(".json")){
            desc = await fetch(a.href) ;
            desc = await desc.json() ;
            console.log(desc)
        }
    }
    // console.log(songs);
    let songName = getSongName(songs);
    console.log(songName)
    
    songName.forEach(element => {
        let li = document.createElement("li");
        li.innerHTML =
            `
        <img src= "items/songs/${currFolder}/cover.jpg"  class="rounded" width="35">
        <div class="songinfo"> 
        <div class="songname">
        ${element}
        </div>
        <div class="artist">
        ${desc.artist}
        </div>
        </div>
        <img src="items/playbutton.svg" alt="" width="20">
        
        `
        document.querySelector(".playlists").getElementsByTagName("ul")[0].insertAdjacentElement("beforeend", li)
    });

    // Adding eventListners to each song 

    // get all li s
    lis = Array.from(document.querySelector(".playlists ul").getElementsByTagName("li"));
    let currSongName = lis[0].getElementsByClassName("songname")[0].innerText;

    let playpause = Array.from(document.body.querySelectorAll(".playbuttonuse"));

    lis.forEach((li, index) => {
        li.addEventListener("click", (e) => {
            lis[currSongno].style.backgroundColor = "#121212"
            currSongName = li.getElementsByClassName("songname")[0].innerText;
            playSong(currSongName)
            playpause[0].setAttribute("src", "/items/pause.svg")
            playpause[1].setAttribute("src", "/items/pause.svg")
            currSongno = index;
            // console.log(currSongno, currSongName);
        });
    })
    console.log("Curr song : " + currSongName)
    currSong.src = ("/items/songs/" + currSongName + ".mp3")
    
    return songs;
    
}

function getSongName(songsloc) {
    let songs = []
    songsloc.forEach(loc => {
        let s = decodeURI(loc.split("songs/")[1].split("/")[1]); // DecodeURI is used to decode and remove %20 instead of space in encoding 
        s = s.slice(0, s.length - 4)
        songs.push(s);
    });
    return songs;
}

const playSong =  (currSongName) => {
    
    currSong.src = ("/items/songs/" + currFolder + "/" + currSongName + ".mp3")
    currSong.play()

    let artist = lis[currSongno].getElementsByClassName("artist")[0].innerText ;

    document.body.querySelectorAll(".currsongName")[0].innerHTML = ` <img src="${"http://nitinbhaskar7.github.io//items/songs/" + currFolder + "/cover.jpg"}" class="rounded"
                            width="40" alt=""> <div> <div>${currSongName}</div> <div class="currartist">${artist}</div> </div>   `
    document.body.querySelectorAll(".currsongName")[1].innerHTML = ` <img src="${"http://nitinbhaskar7.github.io//items/songs/" + currFolder + "/cover.jpg"}" class="rounded"
                            width="40" alt=""> <div> <div>${currSongName}</div> <div class="currartistmob">${artist}</div> <div> </div>  `

    // document.body.querySelector(".time").innerText = "0:0/0:0" 
    
}
async function main() {
    // getting the list of all songs 
    await getFolders();  // getting list of all playlists 
    // to learn a point is imp 
    // if await getFolders() is placed very close to the .card ka eventListener 
    // then it doesn't work 
    // it happens becoz of the innerHTML not yet written in the DOM 
    // therefore we typed in the top of the main
    // or we can type it down close to the eventListenr 
    // and give the event Listener code a timeout of 1000
    
    let songs = await getSongs();

    // play the first song    
    // we need to make sure user interacts with the document for the song to be played like clicking the play button 
    // otherwise by default only if we make changes in the document like the CSS, HTML or JS file only then the song starts playing 
    
        // playSong(currSongName)
        // currSong.pause();


    let playpause = Array.from(document.body.querySelectorAll(".playbuttonuse"));
    let previous = document.body.querySelector(".barbuttons").getElementsByTagName("img")[0];
    let next = document.body.querySelector(".barbuttons").getElementsByTagName("img")[2];

    
    document.addEventListener("keydown" , (e)=>{
        console.log(e)
        if(e.code == "Space"){
            if (currSong.paused) {
                currSong.play();

                playpause[0].src = "items/pause.svg"
                playpause[1].src = "items/pause.svg"
            }
            else {
                currSong.pause();
                playpause[0].src = "items/playbutton.svg"
                playpause[1].src = "items/playbutton.svg"
            }
        }
        else if(e.code == "ArrowRight"){
            currSong.currentTime += 5 ;
        }
        else if(e.code == "ArrowLeft"){
            currSong.currentTime -= 5 ;
        }

    })
   
    
   
    // adding event listner to play and pause 
    playpause.forEach(ele => {
        
        ele.addEventListener("click", (e) => {
            if (currSong.paused) {
                currSong.play();
                playpause[0].src = "items/pause.svg"
                playpause[1].src = "items/pause.svg"
            }
            else {
                currSong.pause();
                playpause[0].src = "items/playbutton.svg"
                playpause[1].src = "items/playbutton.svg"
            }
        })
    });

    next.addEventListener("click", (e) => {
        if (currSong.paused) {
            playpause[0].src = "items/pause.svg"
            playpause[1].src = "items/pause.svg"
        }
        lis[currSongno].style.backgroundColor = "#121212"

        currSongno++;
        if (currSongno == lis.length) {
            currSongno = 0;
        }
        playSong(lis[currSongno].getElementsByClassName("songname")[0].innerText);
    })
    console.log(lis);

    previous.addEventListener("click", (e) => {
        if (currSong.paused) {
            playpause[0].src = "items/pause.svg"
            playpause[1].src = "items/pause.svg"
        }
        lis[currSongno].style.backgroundColor = "#121212"

        currSongno--;
        if (currSongno == -1) {
            currSongno = lis.length - 1;
        }
        playSong(lis[currSongno].getElementsByClassName("songname")[0].innerText);
    })
    console.log(lis);

    // adding Name and duration 

    
    

    // listening for time update event 

    currSong.addEventListener("timeupdate", () => {
        console.log(currSong.currentTime, currSong.duration)

        let currentTime = toMinutes(currSong.currentTime);
        let currentDuration = toMinutes(currSong.duration);
        document.querySelector(".time").innerText = currentTime + "/" + currentDuration
        let p = currSong.currentTime / currSong.duration * 100;
        document.querySelector(".seeder").style.left = p + "%";
        document.querySelectorAll(".colorbar")[0].style.width = p + "%"
        document.querySelectorAll(".colorbar")[1].style.width = p + "%"
    })

    // listening for seeder 
    document.querySelector(".seedbar").addEventListener("click", (e) => {
        console.log(e);
        console.log(e.offsetX) // learning 
        console.log(e.target) //gives the element clicked // learning 
        console.log(e.target.getBoundingClientRect()["width"]) // learning 
        let p = e.offsetX / e.currentTarget.getBoundingClientRect()["width"] * 100;
        console.log(p)
        document.querySelector(".seeder").style.left = p + "%";
        // updating currTime 
        currSong.currentTime = p * currSong.duration / 100;
        e.stopPropagation()
    })

    currSong.addEventListener("play", () => {
        lis[currSongno].style.backgroundColor = "#242424"
    })
    currSong.addEventListener("ended", () => {
        lis[currSongno].style.backgroundColor = "#121212";
        currSongno++;
        if (currSongno == lis.length) {
            currSongno = 0;
        }
        playSong(lis[currSongno].getElementsByClassName("songname")[0].innerText);
    })
    // listening on hamburger Media Query 

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0%"
    })
    // listening on back Media Query 
    document.querySelector(".backButton").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"
    })
    // listening on volume button 
    document.querySelector(".volumebar").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log(e);
        console.log(e.target.value);
        console.log(e.target);
        // to change volume in audio 
        // audio.volume = (0-1)
        currSong.volume = parseInt(e.target.value) / 100;

        document.querySelector(".volumebar>img").setAttribute("src", "items/volume.svg");
        if(currSong.volume == 0 ){
            document.querySelector(".volumebar>img").setAttribute("src", "items/mute.svg");

        }
    });
    
    // Adding eventListner to volume img for mute unmute 
    document.querySelector(".volumebar>img").addEventListener("click", (e) => {
        console.log(e.target.getAttribute("src"));
        let img = e.target;
        if (img.getAttribute("src") == "items/mute.svg") {
            img.setAttribute("src", "items/volume.svg");
            console.log(e.target.getAttribute("src"));
            document.querySelector(".volumebar>input").value = 10;
        }
        else if (img.getAttribute("src") == "items/volume.svg") {
            img.setAttribute("src", "items/mute.svg");
            document.querySelector(".volumebar>input").value = 0;
            console.log(e.target.getAttribute("src"));
        }
        currSong.volume = parseInt(document.querySelector(".volumebar>input").value) / 100;


    })


    document.querySelector(".clicker").addEventListener("click" , (e)=>{
        console.log(e)
        document.querySelector(".playbar").classList.add("flex");

        document.querySelector(".bringdown").classList.add("block");
        document.querySelector(".bringdown").classList.remove("none");

        document.querySelector(".mobplaybar").classList.add("none");
    })
    document.querySelector(".toggler").addEventListener("click" , (e)=>{
        console.log(e)
        document.querySelector(".playbar").classList.remove("flex");
        
        document.querySelector(".bringdown").classList.remove("block");
        document.querySelector(".bringdown").classList.add("none");

        document.querySelector(".mobplaybar").classList.remove("none");
    })
    // currentTarget and target 
    // when we add an event listener lets say to a div 
    // then suppose we click the image inside the div then e.target returns the image tag
    // but if we check e.currentTarget then even though we clicked the image it returns the div since div is the one the event listner is attached on 

    // Adding EventListners to Playlists 

    
    // Finding the Playlist name and Description using a JSON file in the folder 

    

    


    console.log(document.getElementsByClassName("playlistcont")[0])
    let cards = document.getElementsByClassName("card") 
    console.log("Cards : "  , cards)
    cards = Array.from(cards)
    console.log("Cards : "  , cards)
    for (const card of cards) {
        console.log(card);
        card.addEventListener("click", async (e) => {
            document.querySelector(".playlists > ul").innerHTML = ""
            console.log(e.currentTarget.dataset.folder)

            currFolder = e.currentTarget.dataset.folder;
            currSongno = 0;
            
            songs = await getSongs();
            // document.querySelector(".seeder").style.left = 0 ;
            console.log(lis[currSongno].getElementsByClassName("songname")[0].innerText);
            playSong(lis[currSongno].getElementsByClassName("songname")[0].innerText);
            playpause[0].src = "items/pause.svg"
            playpause[1].src = "items/pause.svg"

        })
    }
}
main()
