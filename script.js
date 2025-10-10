const searchContainer = document.querySelector(".search-container");
const searchIcon = document.querySelector(".search-icon");
const searchInput = document.querySelector(".search-input");

searchIcon.addEventListener("click", () => {
  searchContainer.classList.toggle("active");
  if (searchContainer.classList.contains("active")) {
    searchInput.focus();
  }
});

let likes = [1];

// ================= Track List =================
const tracks = [
  {
    id: 1,
    title: "Sahiba",
    artist: "Aditya Rikhari",
    album: "Single",
    duration: "3:10",
    url: "Songs/Sahiba Priya Saraiya 128 Kbps.mp3",
    albumArt: "album/sahiba.jpg",
    isMarathi: false,
    liked: false,
  },
  {
    id: 2,
    title: "Paro",
    artist: "Aditya Rikhari",
    album: "Single",
    duration: "1:10",
    url: "Songs/Paro.mp3",
    albumArt: "album/paro.jpg",
    isMarathi: false,
    liked: true,
  },
  {
    id: 3,
    title: "Akhiyaan Gulaab (Teri Baaton Mein Aisa Uljha Jiya)",
    artist: "Aditya Rikhari",
    album: "Single",
    duration: "1:10",
    url: "Songs/Akhiyaan Gulaab (Teri Baaton Mein Aisa Uljha Jiya)-(Mr-Jat.in).mp3",
    albumArt: "album/Akhiyaan Gulab.jpg",
    isMarathi: false,
    liked: true,
  },
  {
    id: 4,
    title: "Ye Go Ye Ye Maina",
    artist: "Aditya Rikhari",
    album: "Single",
    duration: "1:10",
    url: "Songs/Ye Go Ye Ye Maina (PenduJatt.Com.Se).mp3",
    albumArt: "album/maina.jpg",
    isMarathi: true,
    liked: true,
  },
];

// ================= Utils =================

function durationToSeconds(str) {
  const [m, s] = str.split(":").map(Number);
  return m * 60 + s;
}

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds); // 👈 fixes floating-point decimals
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function findSong(id) {
  return tracks.find((t) => t.id === id);
}

// ================= Playlist State =================
let playlist = [
  {
    name: "Liked Songs",
    songs: [],
  },
];

let count = 0;
function createPlaylist() {
  playlist.push({
    name: "#My PlayList " + count++,
    songs: [],
  });

  document.getElementById("playlist").classList.add("hiden");
  loadPlaylist();
}

// ================= Player State =================
let currentTrackIndex = 0;
let isPlaying = false;
let music = new Audio(tracks[currentTrackIndex].url);

// ================= Load playlists =============
function loadPlaylist() {
  let playlistsHTML = "";
  playlist.forEach((pl, index) => {
    const firstSong = pl.songs[0]
      ? findSong(pl.songs[0]).albumArt
      : "assests/music.jpg";

    playlistsHTML += `
      <div class="playlist-item" data-index="${index}">
          <img src="${firstSong}" alt="${pl.name}">
          <div class="playlist-info">
              <h4>${pl.name}</h4>
             <p>Playlist • <span id="likes_count">${
               pl.name == playlist[0].name ? likes.length : ""
             }</span> song</p>
          </div>
      </div>
    `;
  });

  document.getElementById("user-playlists").innerHTML = playlistsHTML;

  document
    .querySelectorAll("#user-playlists .playlist-item")
    .forEach((item) => {
      item.addEventListener("click", () => {
        const index = item.dataset.index;
        playlistRender(index);
        toggleMainContent();
      });
    });
}

// ================= Load Track =================
function loadTrackIntoPlayer(i) {
  currentTrackIndex = i;
  music.src = tracks[i].url;

  document.querySelector(".album-title").textContent = tracks[i].title;
  document.querySelector(".album-info").textContent = tracks[i].artist;
  document.querySelector(".album-image").src = tracks[i].albumArt;

  if (tracks[i].liked) {
    document.getElementById("fav").className = "fa-solid fa-heart album-icon";
  } else {
    document.getElementById("fav").className = "fa-regular fa-heart album-icon";
  }

  music.addEventListener("loadedmetadata", () => {
    document.querySelector(".tot-time").textContent = formatTime(
      music.duration
    );
  });

  music.addEventListener("timeupdate", () => {
    document.querySelector(".curr-time").textContent = formatTime(
      music.currentTime
    );
    updateProgressBar();
  });
}

// ================= Play / Pause =================
function togglePlayPause() {
  const playBtn = document.querySelector(".play-button");
  if (isPlaying) {
    music.pause();
    playBtn.className =
      "fa-solid fa-circle-play player-control-icon play-button";
  } else {
    music.play();
    playBtn.className =
      "fa-solid fa-circle-pause player-control-icon play-button";
  }
  isPlaying = !isPlaying;
}

// ================= Progress Bar =================
function updateProgressBar() {
  const progressBar = document.getElementById("progress");
  if (music.duration > 0) {
    progressBar.value = (music.currentTime / music.duration) * 100;
  }
}

document.getElementById("progress").addEventListener("input", (e) => {
  const percent = e.target.value;
  music.currentTime = (percent / 100) * music.duration;
});

// ================= Playlist Render =================
function playlistRender(playlistIndex) {
  const pl = playlist[playlistIndex];
  let totalDuration = 0;

  document.getElementById("playlistTitle").textContent = pl.name;

  const currentPlayListSongs = pl.songs
    .map((id, index) => {
      const song = tracks.find((t) => t.id === id);
      if (!song) return "";
      totalDuration += durationToSeconds(song.duration);
      return `
        <li class="song-row">
          <span>${index + 1}</span>
          <div class="song-info">
            <img src="${song.albumArt}" alt="${song.title}">
            <div>
              <h4>${song.title}</h4>
              <p>${song.artist}</p>
            </div>
          </div>
          <span>${song.album}</span>
          <span>${song.duration}</span>
          <button class="removeBtn">
            <i class="fa-solid fa-trash"></i>
            <span class="btn-text">Remove</span>
          </button>
        </li>`;
    })
    .join("");

  document.querySelector(".currentPlayListSongs").innerHTML =
    currentPlayListSongs;

  const remainingSongs = tracks.filter((song) => !pl.songs.includes(song.id));
  const recommendedHTML = remainingSongs
    .map(
      (song) => `
        <li>
          <div class="song-info">
            <img src="${song.albumArt}" alt="${song.title}">
            <div>
              <h4>${song.title}</h4>
              <p>${song.artist}</p>
            </div>
          </div>
          <button class="addBtn" onclick="addToPlaylist(${song.id},'${pl.name}',${playlistIndex})">Add</button>
        </li>`
    )
    .join("");

  document.querySelector(".recommendedSongs").innerHTML = recommendedHTML;

  const recommendedSection = document.querySelector(".recommended");
  if (remainingSongs.length === 0) {
    recommendedSection.classList.add("hiden");
  } else {
    recommendedSection.classList.remove("hiden");
  }

  document.getElementById("playlistTotal").textContent =
    formatTime(totalDuration);

  // ---- Rename Logic ----
  const playlistTitle = document.getElementById("playlistTitle");
  const renameIcon = document.querySelector(".rename-icon");

  if (playlistIndex == 0) renameIcon.style.display = "none";
  else renameIcon.style.display = "inline";

  renameIcon.onclick = () => {
    playlistTitle.contentEditable = true;
    playlistTitle.focus();
  };

  playlistTitle.onblur = () => {
    const newName = playlistTitle.textContent.trim();
    if (newName) {
      playlist[playlistIndex].name = newName;
      loadPlaylist();
    }
    playlistTitle.contentEditable = false;
    playlistRender(playlistIndex);
  };

  playlistTitle.onkeydown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      playlistTitle.blur();
    }
  };
}

function repeatPlay() {
  music.currentTime = 0;
  music.play();
  isPlaying = true;
  document.querySelector(".play-button").className =
    "fa-solid fa-circle-pause player-control-icon play-button";
}

// ================= Add Song To Playlist =================
function addToPlaylist(id, name, playlistIndex) {
  playlist.forEach((elem) => {
    if (name == elem.name) elem.songs.push(id);
  });
  playlistRender(playlistIndex);
}

// ================= Volume Control =================
document.querySelector(".volume-bar").addEventListener("change", (e) => {
  music.volume = e.target.value / 100;
});

// ================= Toggle main content =================
function toggleMainContent() {
  document.querySelectorAll(".main-content").forEach((el) => {
    el.classList.toggle("hiden");
  });
}
document
  .querySelector(".close-btn")
  .addEventListener("click", toggleMainContent);

// ================= Init =================
loadPlaylist();
loadTrackIntoPlayer(0);

// ================= Generate Cards =================
const Trending = document.getElementById("Trending");
const Marathi = document.getElementById("best-of-marathi");

tracks.forEach((element, index) => {
  const cardHTML = `
    <div class="card" data-id="${index}">
      <img src="${element.albumArt}" class="card-img" alt="${element.title}">
      <p class="card-title">${element.title}</p>
      <p class="card-info">Artist - ${element.artist}</p>
    </div>
  `;

  if (element.isMarathi) {
    Marathi.innerHTML += cardHTML;
  } else {
    Trending.innerHTML += cardHTML;
  }
  if (element.liked) likes.push(index);
});

// ================= Card Click = Load Track =================
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("click", () => {
    let id = card.getAttribute("data-id");
    loadTrackIntoPlayer(parseInt(id));
    music.play();
    isPlaying = true;
    document.querySelector(".play-button").className =
      "fa-solid fa-circle-pause player-control-icon play-button";
  });
});

function muteUnmute() {
  const volumeIcon = document.getElementById("volume-icon");

  // SVG paths
  const muteSVG = `
    <path d="M13.86 5.47a.75.75 0 0 0-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 0 0 8.8 6.53L10.269 8l-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 0 0 1.06-1.06L12.39 8l1.47-1.47a.75.75 0 0 0 0-1.06"></path>
    <path d="M10.116 1.5A.75.75 0 0 0 8.991.85l-6.925 4a3.64 3.64 0 0 0-1.33 4.967 3.64 3.64 0 0 0 1.33 1.332l6.925 4a.75.75 0 0 0 1.125-.649v-1.906a4.7 4.7 0 0 1-1.5-.694v1.3L2.817 9.852a2.14 2.14 0 0 1-.781-2.92c.187-.324.456-.594.78-.782l5.8-3.35v1.3c.45-.313.956-.55 1.5-.694z"></path>
  `;

  const unmuteSVG = `
    <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.64 3.64 0 0 1-1.33-4.967 3.64 3.64 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.14 2.14 0 0 0 0 3.7l5.8 3.35V2.8zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88"></path>
    <path d="M11.5 13.614a5.752 5.752 0 0 0 0-11.228v1.55a4.252 4.252 0 0 1 0 8.127z"></path>
  `;

  if (music.volume > 0) {
    music.volume = 0;
    volumeIcon.innerHTML = muteSVG;
    document.querySelector(".volume-bar").value = 0;
    console.log("muted");
  } else {
    console.log("unmuted");

    music.volume = 0.5;
    volumeIcon.innerHTML = unmuteSVG;
    document.querySelector(".volume-bar").value = music.volume * 100;
    console.log(music.volume);
  }
}
