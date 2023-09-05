document.addEventListener('DOMContentLoaded', function() {

  let loggedUserId = 0
 
    const div1 = document.getElementById("div1");
    const userSongList = document.getElementById("div2");
    const div4 = document.getElementById("div4");
    const divSongInfo = document.getElementById("div5");

    const divToDelete = document.getElementById("div-to-Delete");



    div1.style.visibility = 'hidden';
    userSongList.style.visibility = 'hidden';
    div4.style.visibility = 'hidden';
    divSongInfo.style.visibility = 'hidden';
    divToDelete.style.visibility = 'visible';


 //Login form and text boxes
    const logForm = document.getElementById("login");
    const logFormEmail = document.getElementById("login-email");
    const logFormPass = document.getElementById("login-pass");

 //Create form and user boxes
    const createForm = document.getElementById("create-account");
    const createFormEmail = document.getElementById("create-email");
    const createFormPass = document.getElementById("create-pass");
    const createFormImage = document.getElementById("create-photo")

  //update form and user boxes
    const updateForm = document.getElementById("update-password");
    const updateFormEmail = document.getElementById("update-email");
    const updateFormOldPass = document.getElementById("update-oldpass");
    const updateFormNewPass = document.getElementById("update-newpass");
    const updateFormCheckNewPass = document.getElementById("update-checknewpass");

  //We will need to delete this whole div, and show the others after logging in

  

 //Submit Events:
  //Login 
  logForm.addEventListener("submit", event => {
    event.preventDefault();

    const logEmail = logFormEmail.value;
    const logPass = logFormPass.value;

    fetch("http://localhost:3000/users")
    .then(resp => resp.json())
    .then(allUser => {
        console.log(allUser.length);

        let userFound = false; 

        for (let i = 0; i < allUser.length; i++) {

            if (logEmail === allUser[i].user_email && logPass === allUser[i].password) {  
                
                loggedUserId = (1+i)
                userFound = true;
                break;
            }
        }
        if (!userFound) {
            alert('Incorrect Email or Password');
            logFormPass.value = "";
        } else {
          alert(`User found, ID: ${loggedUserId}`)
          logFormEmail.value = "";
          logFormPass.value = "";
          div1.style.visibility = 'visible';
          userSongList.style.visibility = 'visible';
          div4.style.visibility = 'visible';
          divSongInfo.style.visibility = 'visible';
          divToDelete.style.display = 'none';

          startWeb(loggedUserId)

        };
    });
    
  }); 

 //Submit Events:
  //Create account
  createForm.addEventListener("submit", event => {
    event.preventDefault();

    const createEmail = createFormEmail.value;
    const createPass = createFormPass.value;
    const createphoto = createFormImage.value;

    if (createEmail.trim() == "") {
      alert("You need an email");
      location.reload()
    } 
    else if (createPass.trim() == "" ) {
      alert("At least 1 character for your password");
      location.reload()
    }
    else if (createPass.trim().length < createPass.length) {
      alert("Password can not contain spaces");
      location.reload()
    } 
    
    else {
  
    fetch("http://localhost:3000/users")
    .then(resp => resp.json())
    .then(allUser => {
        console.log(allUser.length);

        let freename = true; 

        for (let i = 0; i < allUser.length; i++) {

            if (createEmail === allUser[i].user_email) {              
                freename = false;
                break;
            }
        }
        if (!freename) {
            alert('Email in already use');
            createFormEmail.value = "";
            createFormPass.value = "";
            createFormImage.value = "";
        } else {         
          const newUser = {
            id:"",
            user_email: createEmail ,
            password: createPass,
            user_photo: createphoto,
            user_music: []
          }
          fetch(`http://localhost:3000/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
            })
            .then(response => response.json())
            .then(newdataadded => {
              createFormEmail.value = "";
              createFormPass.value = "";
              createFormImage.value = "";
              alert('Account created');
            });
        };
    });
  }
  }); 

  //Submit Events:
  //Update Password
  updateForm.addEventListener("submit", event => {
    event.preventDefault();

    const updateEmail= updateFormEmail.value;
    const updateOldPass= updateFormOldPass.value;
    const updateNewPass= updateFormNewPass.value;
    const updateCheckNewPass= updateFormCheckNewPass.value;


    fetch("http://localhost:3000/users")
    .then(resp => resp.json())
    .then(allUser => {
        console.log(allUser.length);

        let userFound = false; 

        for (let i = 0; i < allUser.length; i++) {

            if (updateEmail === allUser[i].user_email && updateOldPass === allUser[i].password) {  
                
                loggedUserId = (1+i)
                userFound = true;
                break;
            }
        }
        if (!userFound) {
            alert('Incorrect Email or Old Password');
            updateFormOldPass.value = "";
            updateFormNewPass.value = "";
            updateFormCheckNewPass.value = "";
        } else {
          alert(`User and old pasword found`)   
              
          if ((updateNewPass === updateCheckNewPass) && (updateNewPass.trim() !== "") && (updateNewPass.trim().length <= updateNewPass.length)) {
          
            let userupdate = {
              password : updateNewPass
            }

            fetch(`http://localhost:3000/users/${loggedUserId}`, {
            method: 'PATCH',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(userupdate)
            })
            .then(response => {
                location.reload()
            })
          } else {
            alert('New passwords do not match')
            updateFormOldPass.value = "";
            updateFormNewPass.value = "";
            updateFormCheckNewPass.value = "";
          }          
        };
    });
  }); 

  
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// index2:
let userSongs = []
    
    
     
    //User info only in Div1
    const userName = document.getElementById("user-name")
    const userEmail = document.getElementById("user-email")
    const userPhoto = document.getElementById("user-image")
    const btnAddPhoto = document.getElementById("update-photo")
    const btnChangeUserName = document.getElementById("update-username")
    
    

    
    
    //Load user info (AND POP UP TO CREATE USERNAME)

    function startWeb(a) {
    
        fetch(`http://localhost:3000/users/${a}`)
        .then((response) => {       
            if (response.status === 404) {
              console.log(`User with ID ${userId} does not exist.`);
            } else {
              return response.json();
            }
          })
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
                        const userSongAlbum = document.createElement('li')
                        const userSongYear = document.createElement('li')
                        const usersongGenre = document.createElement('li')
                        const userSongimg = document.createElement('img')
                        const userSongm4a = document.createElement('audio')
                        const usersource = document.createElement("source");
                        const deleteUserSongBtn = document.createElement("button")
                        const userSongId = songData[i].id
    
                        usersongName.textContent = songData[i].name
                        usersongArtist.textContent = songData[i].artist
                        userSongYear.textContent = songData[i].year
                        usersongGenre.textContent = songData[i].genre
                        userSongAlbum.textContent = songData[i].album
                        userSongimg.src = songData[i].img

                        userSongm4a.controls = true;             
                        usersource.src = songData[i].url;
                        usersource.type = "audio/mp4";
                        deleteUserSongBtn.textContent = "Delete"

                        userSongList.appendChild(oneSong)  
                        oneSong.appendChild(usersongName)
                        oneSong.appendChild(usersongArtist)  
                        oneSong.appendChild(userSongAlbum)         
                        oneSong.appendChild(userSongYear)
                        oneSong.appendChild(usersongGenre) 
                        oneSong.appendChild(userSongimg)
    
                        userSongm4a.appendChild(usersource);              
                        oneSong.appendChild(userSongm4a); 
                        oneSong.appendChild(deleteUserSongBtn)

                        deleteUserSongBtn.addEventListener("click", function (){
                        const ulElement = deleteUserSongBtn.parentElement;
                        ulElement.parentElement.removeChild(ulElement);


                            fetch(`http://localhost:3000/users/${loggedUserId}`)
                            .then(response => response.json())
                            .then(userData => {
                                // Find the index of the value to remove in user_music
                                const index = userData.user_music.indexOf(userSongId);

                                
                                // If the value is found, remove it from user_music
                                userData.user_music.splice(index, 1);

                                // Create a new object with the updated user data
                                const updatedUserData = {
                                    ...userData,
                                    user_music: userData.user_music
                                };

                               
                                fetch(`http://localhost:3000/users/${loggedUserId}`, {
                                    method: 'PUT', 
                                    headers: {
                                    'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(updatedUserData)
                                })
                                    .then(response => response.json())
                                    .then(updatedData => {
                                   
                                    })
                                    .catch(error => {
                                    console.error('Error updating user data:', error);
                                    });
                                
                            })
                            .catch(error => {
                            });
                        


                        })


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

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    const discoverForm = document.getElementById("discover-form")
    const selectGenreForm = document.getElementById("genre-dropdown")
    const selectNumberSongsForm = document.getElementById("number-to-discover")
    
    const randomNumbers = []

    const resetButton = document.getElementById("reset-all")

    discoverForm.addEventListener("submit" , (event) => {
        event.preventDefault();

        const amountToSearch = selectNumberSongsForm.value
        const genretoSearch = selectGenreForm.value

        generateRandomNumbers(amountToSearch) 


        function generateRandomNumbers(a) {
                    
            for (let i = 0; i < a; i++) {
              const randomNumber = Math.floor(Math.random() * 200) + 1;
              randomNumbers.push(randomNumber);
            }
            randomNumbers.sort((a, b) => a - b);
          
            return randomNumbers;
          }

        get200songs(genretoSearch) 



            function get200songs(a){
                let ids = 0
                fetch(`https://itunes.apple.com/search?term=${a}&entity=musicTrack&limit=200`)
                .then(response => response.json())
                .then(songs => {
                    songs.results.forEach(song => {

                    ids = ids + 1
                    let NewSong = {
                        id: ids,
                        name: song.trackName,
                        artist: song.artistName,
                        album: song.collectionName,
                        year: song.releaseDate,
                        genre: song.primaryGenreName,
                        img: song.artworkUrl100,
                        url: song.previewUrl
                        };

                    for (i = 0; i<amountToSearch;i++) {
                        console.log(1)
                        if (randomNumbers[i] == NewSong.id ) {

                            const ulSong = document.createElement("ul");
                            divSongInfo.appendChild(ulSong);
                
                            const l1SongName = document.createElement("li");
                            l1SongName.textContent = NewSong.name;
                            ulSong.appendChild(l1SongName); 
                
                            const l1Sonartist = document.createElement("li");
                            l1Sonartist.textContent = NewSong.artist;
                            ulSong.appendChild(l1Sonartist); 
                
                            const l1SongcollectionName = document.createElement("li");
                            l1SongcollectionName.textContent = NewSong.album;
                            ulSong.appendChild(l1SongcollectionName); 
                
                
                            const l1SongreleaseDate = document.createElement("li");
                            const yearin4digits = NewSong.year.substring(0, 4)
                            l1SongreleaseDate.textContent = yearin4digits;
                            ulSong.appendChild(l1SongreleaseDate); 
                
                            const l1Songimage = document.createElement("img");
                            l1Songimage.src = NewSong.img;
                            ulSong.appendChild(l1Songimage); 

                            const l1SongGenre = document.createElement("li");
                            l1SongGenre.textContent = NewSong.genre;

                
                            const l1Songlink = document.createElement("audio");
                            l1Songlink.controls = true;
                            const source = document.createElement("source");
                            source.src = NewSong.url;
                            source.type = "audio/mp4";
                            l1Songlink.appendChild(source);              
                            ulSong.appendChild(l1Songlink); 


                            l1Songimage.addEventListener('click', event => {

                                let newuserdata 

                                fetch(`http://localhost:3000/musicdata/`)
                                .then(response => response.json())
                                .then(songs => {

                                    let newidnumber = songs.length
                                

                                let newAddedsong = {
                                    id: newidnumber + 1,
                                    name: l1SongName.textContent,
                                    artist: l1Sonartist.textContent,
                                    album: l1SongcollectionName.textContent,
                                    year: l1SongreleaseDate.textContent,
                                    genre: l1SongGenre.textContent,
                                    img: l1Songimage.src,
                                    url: source.src
                                    };

                                    fetch(`http://localhost:3000/musicdata/`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(newAddedsong)
                                    })
                                    .then(response => response.json())
                                    .then(newdataadded => {

                                    })

                                    fetch(`http://localhost:3000/users/${loggedUserId}`)
                                    .then(response => response.json())
                                    .then(user => { 

                                        let currentusersongs = user.user_music
                                        currentusersongs.push(newAddedsong.id)
                                        console.log(loggedUserId)
                                        

                                        newuserdata = {
                                            user_music : currentusersongs
                                            } 

                                            fetch(`http://localhost:3000/users/${loggedUserId}`, {
                                                method: 'PATCH',
                                                headers: {
                                                'Content-Type': 'application/json'
                                                },
                                                body: JSON.stringify(newuserdata)
                                            })
                                                .then(response => {
                                            })                                    
                                    })

                                alert("Song added!")
                                 })        
                            })

                        }
                    }
                    })                          
                })  

            }
    })
    resetButton.addEventListener('click', function () {

        divSongInfo.innerHTML = '';
    });
    
  
});
