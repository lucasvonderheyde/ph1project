document.addEventListener('DOMContentLoaded', function() {

    //We need this to start
    const loggedUserId = window.prompt("Enter id:");
    let userSongs = []

    startWeb(loggedUserId)
    


    //User info only in Div1
    const userEmail = document.getElementById("user-email")
    const userPhoto = document.getElementById("user-image")
    const btnAddPhoto = document.getElementById("update-photo")
    

    //User info only in Div2

    const userSongList = document.getElementById("div2")

    
    //Funtions
    //Load user info
    function startWeb(a) {

        fetch(`http://localhost:3000/users/${a}`)
        .then(resp => resp.json())
        .then(user => {
            userEmail.textContent = user.user_name
            userPhoto.src = user.user_photo

            userSongs = user.user_music
                //this arrange the array "userSons" by numeric order
                function compareNumeric(a, b) {
                    return parseInt(a) - parseInt(b);
                }
                userSongs.sort(compareNumeric);
                //now it is in order

            fetch("http://localhost:3000/musicdata")
            .then(resp2 => resp2.json())
            .then(songData => {

                songData.forEach(song => {
                    
                    for (let i = 0; i < userSongs.length; i++) {
                       console.log(1)                        
                        if (song.id == userSongs[i] ) {
                            
                            const oneSong = document.createElement("ul")
                            const usersongName = document.createElement('li')
                            const usersongArtist = document.createElement('li')
                            const userSongYear = document.createElement('li')
                            const usersongGenre = document.createElement('li')

                            usersongName.textContent = song.name
                            usersongArtist.textContent = song.artist
                            userSongYear.textContent = song.year
                            usersongGenre.textContent = song.gener

                            userSongList.appendChild(oneSong)  
                            oneSong.appendChild(usersongName)
                            oneSong.appendChild(usersongArtist)               
                            oneSong.appendChild(userSongYear)
                            oneSong.appendChild(usersongGenre) 
                           break
                        } 
                    }
                }) 
                
                /* CHAT GPT SAYS:
                songData.forEach(song => {
                    const userSongId = userSongs.find(id => id === song.id);

                    if (userSongId) {
                        const oneSong = document.createElement("ul");
                        const usersongName = document.createElement('li');
                        const usersongArtist = document.createElement('li');
                        const userSongYear = document.createElement('li');
                        const usersongGenre = document.createElement('li');

                        usersongName.textContent = song.name;
                        usersongArtist.textContent = song.artist;
                        userSongYear.textContent = song.year;
                        usersongGenre.textContent = song.genre;

                        oneSong.appendChild(usersongName);
                        oneSong.appendChild(usersongArtist);
                        oneSong.appendChild(userSongYear);
                        oneSong.appendChild(usersongGenre);

                        userSongList.appendChild(oneSong);
                    }
                });

                */
            })
        })
    }

    //Events
    //Update user photo
    btnAddPhoto.addEventListener("click", function() {
        const newPhotosrc = window.prompt("Enter new photo link:");
        
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





    })


});