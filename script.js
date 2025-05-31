document.addEventListener("DOMContentLoaded", function () {
  console.log("Welcome to StudyTune!");

  let songIndex = 0;
  let isShuffle = false;
  let isLoop = false;
  let audioElement = new Audio('songs/1.mp3');

  const masterPlay = document.getElementById('masterPlay');
  const myProgressBar = document.getElementById('myProgressBar');
  const masterSongName = document.getElementById('masterSongName');
  const durationDisplay = document.getElementById('duration');
  const shuffleBtn = document.getElementById('shuffle');
  const loopBtn = document.getElementById('loop');

  const toast = document.createElement('div');
  toast.id = 'toast';
  document.body.appendChild(toast);

  const songs = [
    { songName: "Blissful Day", filePath: "1.mp3", coverPath: "1.jpg", duration: "2:34" },
    { songName: "A Walk Downtown", filePath: "2.mp3", coverPath: "2.jpg", duration: "3:01" },
    { songName: "My Notes", filePath: "3.mp3", coverPath: "3.jpg", duration: "2:47" },
    { songName: "Smile for ME", filePath: "4.mp3", coverPath: "4.jpg", duration: "3:10" },
    { songName: "Determined Thoughts", filePath: "5.mp3", coverPath: "5.jpg", duration: "2:55" },
    { songName: "Just Here for the Vibes", filePath: "6.mp3", coverPath: "6.jpg", duration: "3:18" },
    { songName: "I Got This!", filePath: "7.mp3", coverPath: "7.jpg", duration: "2:42" },
    { songName: "Timing is Key", filePath: "8.mp3", coverPath: "8.jpg", duration: "3:06" },
    { songName: "Carnival Fun", filePath: "9.mp3", coverPath: "9.jpg", duration: "3:33" },
    { songName: "Hope", filePath: "10.mp3", coverPath: "10.jpg", duration: "2:58" },
  ];

  const container = document.querySelector('.songItemContainer');
  container.innerHTML = songs.map((song, i) => `
    <div class="songItem" data-index="${i}">
      <img src="${song.coverPath}" alt="${song.songName}">
      <span class="songName">${song.songName}</span>
      <span class="timestamp">${song.duration}</span>
    </div>
  `).join("");

  masterSongName.textContent = songs[songIndex].songName;
  masterPlay.textContent = "🎧 Play";

  masterPlay.addEventListener('click', () => {
    if (audioElement.paused || audioElement.currentTime <= 0) {
      audioElement.play();
      masterPlay.textContent = "💤 Pause";
      highlightPlaying();
    } else {
      audioElement.pause();
      masterPlay.textContent = "🎧 Play";
    }
  });

  audioElement.addEventListener('timeupdate', () => {
    const progress = (audioElement.currentTime / audioElement.duration) * 100;
    myProgressBar.value = progress;
    const mins = Math.floor(audioElement.currentTime / 60);
    const secs = Math.floor(audioElement.currentTime % 60);
    durationDisplay.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  });

  myProgressBar.addEventListener('input', () => {
    audioElement.currentTime = (myProgressBar.value / 100) * audioElement.duration;
  });

  document.querySelectorAll('.songItem').forEach((item, index) => {
    item.addEventListener('click', () => {
      songIndex = index;
      playSong();
    });
  });

  document.getElementById('next').addEventListener('click', () => {
    songIndex = isShuffle ? getRandomIndex(songIndex) : (songIndex + 1) % songs.length;
    playSong();
  });

  document.getElementById('previous').addEventListener('click', () => {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    playSong();
  });

  function playSong() {
    audioElement.src = songs[songIndex].filePath;
    audioElement.currentTime = 0;
    audioElement.play();
    masterSongName.textContent = songs[songIndex].songName;
    masterPlay.textContent = "💤 Pause";
    highlightPlaying();
    showToast(`Now playing: 🎵 <b>${songs[songIndex].songName}</b>`);
  }

  function getRandomIndex(current) {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * songs.length);
    } while (newIndex === current);
    return newIndex;
  }

  function highlightPlaying() {
    document.querySelectorAll('.songItem').forEach(item => {
      item.classList.remove('playing');
    });
    const current = document.querySelector(`.songItem[data-index="${songIndex}"]`);
    if (current) current.classList.add('playing');
  }

  shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active');
    shuffleBtn.textContent = isShuffle ? "🌟 Shuffle On" : "∞ Shuffle";
  });

  loopBtn.addEventListener('click', () => {
    isLoop = !isLoop;
    audioElement.loop = isLoop;
    loopBtn.classList.toggle('active');
    loopBtn.textContent = isLoop ? "🌙 Looping" : "𖦹 Loop";
  });

  audioElement.addEventListener('ended', () => {
    if (!isLoop) {
      document.getElementById('next').click();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    switch (e.code) {
      case 'Space':
        e.preventDefault();
        masterPlay.click();
        break;
      case 'ArrowRight':
        e.preventDefault();
        document.getElementById('next').click();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        document.getElementById('previous').click();
        break;
    }
  });

  function showToast(message) {
    toast.innerHTML = message;
    toast.className = 'show-toast';
    setTimeout(() => {
      toast.className = toast.className.replace('show-toast', '');
    }, 2600);
  }
});
