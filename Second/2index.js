import { fetchArtistsByFirstLetter } from './itunesFetch.js';

document.addEventListener('DOMContentLoaded', function() {

    //We need this to start
    const loggedUserId = window.prompt("Enter id:");
    let userSongs = []
    
    startWeb(loggedUserId)
    
    
    
    //User info only in Div1
    const userName = document.getElementById("user-name")
    const userEmail = document.getElementById("user-email")
    const userPhoto = document.getElementById("user-image")
    const btnAddPhoto = document.getElementById("update-photo")
    const btnChangeUserName = document.getElementById("update-username")
    
    
    //User info only in Div2
    
    const userSongList = document.getElementById("div2")
    
    
    //Load user info (AND POP UP TO CREATE USERNAME)
    function startWeb(a) {
    
        fetch(`http://localhost:3000/users/${a}`)
        .then(resp => resp.json())
        .then(user => {
    
            var nameSelection
    
            if (user.user_name_quest == 0) {
                userName.textContent = user.user_name
    
            } else {
                var i = false;
                while (i === false) {
    
                nameSelection = window.prompt(`Enter new user name! \n Or hit: "Cancel" to leave it for later \n Or type: "NEVER" and we won't ask you again.... \n(but still you can create one later!)`)
                if (nameSelection === null) { 
                    i = true; 
                    } else if (nameSelection.trim() === "") {
                    alert("Write something, dude!");
                    } else if (nameSelection === "NEVER") { 
                    i = true; 
    
                    let updateUserNameQuest = {
                        user_name_quest : 0
                    };
    
                    fetch(`http://localhost:3000/users/${loggedUserId}`, {
                        method: 'PATCH',
                        headers: {
                        'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updateUserNameQuest)
                    })
                        .then(response => {
                    })
    
                    } else {
                    i = true;
                    userName.textContent=nameSelection;
    
                    let updateUserName = {
                        user_name : nameSelection,
                        user_name_quest : 0
                    };
    
                    fetch(`http://localhost:3000/users/${loggedUserId}`, {
                        method: 'PATCH',
                        headers: {
                        'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updateUserName)
                    })
                        .then(response => {
                            
                    })
                    }
                }
            } 
        
            if (user.user_photo == "") {
                alert("Hey! do not forget to update your photo!")
            } 
    
    
            userEmail.textContent = user.user_email
            userPhoto.src = user.user_photo
    
            userSongs = user.user_music
    
                //this arranges the array "userSongs" by numeric order
                function compareNumeric(a, b) {
                    return parseInt(a) - parseInt(b);
                }
                userSongs.sort(compareNumeric);
                //now it is in order
                
    
            fetch("http://localhost:3000/musicdata")
            .then(resp2 => resp2.json())
            .then(songData => {
    
                let x = 0
                let y = 0
    
                for (let i=x; (i < songData.length && y !== userSongs.length) ; i++) {
    
                    for (x =0 ; x < userSongs.length; x++) {
                        
                        if (songData[i].id == userSongs[x]) {                       
    
                        const oneSong = document.createElement("ul")
                        const usersongName = document.createElement('li')
                        const usersongArtist = document.createElement('li')
                        const userSongYear = document.createElement('li')
                        const usersongGenre = document.createElement('li')
    
                        usersongName.textContent = songData[i].name
                        usersongArtist.textContent = songData[i].artist
                        userSongYear.textContent = songData[i].year
                        usersongGenre.textContent = songData[i].genre
    
                        userSongList.appendChild(oneSong)  
                        oneSong.appendChild(usersongName)
                        oneSong.appendChild(usersongArtist)               
                        oneSong.appendChild(userSongYear)
                        oneSong.appendChild(usersongGenre) 
    
                        y = y +1
                        break
                        }
                    } 
                }
            })
        })
    }
    
    //Events
    //Update user photo
    btnAddPhoto.addEventListener("click", function() {
      
        var i = false;
        while (i === false) {
    
            const newPhotosrc = window.prompt("Enter new photo link:");
            if (newPhotosrc === null) { 
                i = true; 
            } else {
                i = true;
        
            let newPhoto = {
                user_photo : newPhotosrc
                } 
    
            fetch(`http://localhost:3000/users/${loggedUserId}`, {
                method: 'PATCH',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(newPhoto)
            })
                .then(response => {
                    userPhoto.src = newPhotosrc
            })
            }
        }
    })
    
    //Events
    //Update user name
    btnChangeUserName.addEventListener("click", function() {
        
        var i = false;
        while (i === false) {
    
            const newUserName = window.prompt("Enter new User Name:");
    
            if (newUserName === null) { 
                i = true; 
            } else if (newUserName.trim() === "") {
                    alert("Write something, dude!");
            } else {
                i = true;
                userName.textContent=newUserName;
    
                let updateUserName = {
                    user_name : newUserName,
                    user_name_quest : 0
                };
                    
                fetch(`http://localhost:3000/users/${loggedUserId}`, {
                    method: 'PATCH',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updateUserName)
                })
                    .then(response => {
                            
                })
            }
        }
    })
    
    })    
            