const genreSelection = document.querySelector("#genre-dropdown");
const numberOfSongsToDiscover = document.querySelector('#number-to-discover')
const discoverButton = document.querySelector("#discover-music")
const discoveryDiv = document.querySelector("#div-4")
const newMusicList = document.querySelector("#random-music-results")
const songInformationDiv = document.querySelector('#song-information')
const artistName = document.querySelector('#artist-name')
const albumName = document.querySelector('#album-name')
const albumImage = document.querySelector('#album-image')
const audioPreview = document.querySelector('#audio-preview')
const searchResetButton = document.querySelector('#search-again')


const musicSelectedByGenre = []
const randomlySelectedSongForUser = []

genreSelection.addEventListener("change", event =>{
  const selectedGenre = event.target.value
  fetchMusicByGenre(selectedGenre)
  genreSelection.disabled = true

})

numberOfSongsToDiscover.addEventListener("change", event =>{
    const selectedNumberOfSongs = event.target.value 
    randomIdSelectionFromGenre(musicSelectedByGenre, selectedNumberOfSongs)
    numberOfSongsToDiscover.disabled = true

})

discoverButton.addEventListener("click", event =>{
    randomlySelectedSongForUser.forEach(song =>{
        const  groupNameListElement = document.createElement("li")
        groupNameListElement.setAttribute('class', 'random-song-result')
        groupNameListElement.textContent = song.trackName
        
        newMusicList.append(groupNameListElement)
        
        createSongInformation(groupNameListElement, song)

    })
})

searchResetButton.addEventListener('click', event =>{
    artistName.textContent = ""
    albumName.textContent = ""
    albumImage.src = ""
    audioPreview.src = ""

    musicSelectedByGenre.length = 0
    randomlySelectedSongForUser.length = 0

    genreSelection.disabled = false
    numberOfSongsToDiscover.disabled = false

    genreSelection.selectedIndex = 0
    numberOfSongsToDiscover.selectedIndex = 0

    const getLiElementsToRemove = document.getElementsByClassName('random-song-result')
    for (let i = getLiElementsToRemove.length -1; -1 < i; i--){
        console.log(getLiElementsToRemove)
        getLiElementsToRemove[i].remove()
        console.log(getLiElementsToRemove)
    }
})

function fetchMusicByGenre(genre) {
fetch(`https://itunes.apple.com/search?term=${genre}&entity=musicTrack&limit=200`)
  .then(response => response.json())
  .then(songs => {
    songs.results.forEach(song =>{
        if (song.primaryGenreName === genre){
            musicSelectedByGenre.push(song)
        }  
    })
  });
}

function randomIdSelectionFromGenre(arrOfSongsByGenre, userNumberOfSongs){
    for (let i = 0; i < userNumberOfSongs; i++){
        randomlySelectedSongForUser.push(arrOfSongsByGenre[(Math.floor(Math.random() * arrOfSongsByGenre.length))])
    }
}

function createSongInformation(groupNameListElement, song){
    groupNameListElement.addEventListener('click', event =>{
        artistName.textContent = song.artistName
        albumName.textContent = song.collectionName
        albumImage.src = song.artworkUrl100
        audioPreview.src = song.previewUrl
    })
}

