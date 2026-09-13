const fs = require("fs");
const { spawn } = require("node:child_process");

// ==============================
// MILESTONE 1: READ SONGS
// ==============================

const songsPath = "./songs";

let songs;

try {

    songs = fs
        .readdirSync(songsPath)
        .filter((file) => file.endsWith(".mp3"));

} catch (error) {

    console.log("Error: songs folder not found.");
    process.exit(1);
}

if (songs.length === 0) {

    console.log("No MP3 files found in the songs folder.");
    process.exit(0);
}


// ==============================
// MILESTONE 3: STATE
// ==============================

let selectedIndex = 0;


// ==============================
// MILESTONE 4 & 5: PLAYER STATE
// ==============================

let currentProcess = null;
let isPaused = false;


// ==============================
// DISPLAY PLAYLIST
// ==============================

function displaySongs() {

    process.stdout.write("\x1b[2J");
    process.stdout.write("\x1b[H");

    console.log("🎵 TERMINAL MUSIC PLAYER\n");

    for (let i = 0; i < songs.length; i++) {

        if (i === selectedIndex) {
            console.log(`▶ ${songs[i].replace(".mp3", "")}`);
        } else {
            console.log(`  ${songs[i].replace(".mp3", "")}`);
        }
    }

    console.log("\n↑ ↓ Navigate");
    console.log("ENTER Play");
    console.log("SPACE Pause/Resume");
    console.log("N Next");
    console.log("P Previous");
    console.log("S Stop");
    console.log("Q Quit");
}


// ==============================
// PLAY SONG
// ==============================

function playSong() {

    // Stop old process
    if (currentProcess) {
        currentProcess.kill("SIGTERM");
        currentProcess = null;
    }

    const songPath = `${songsPath}/${songs[selectedIndex]}`;

    const newProcess = spawn("afplay", [songPath]);

    currentProcess = newProcess;
    isPaused = false;

    console.log(
        `\n▶ Now Playing: ${songs[selectedIndex].replace(".mp3", "")}`
    );


    // ==========================
    // SONG FINISHED
    // ==========================

    newProcess.on("close", () => {

        // Ignore old process
        if (currentProcess !== newProcess) {
            return;
        }

        currentProcess = null;
        isPaused = false;


        // Automatically play next song
        if (selectedIndex < songs.length - 1) {

            selectedIndex++;

            displaySongs();

            playSong();
        }
    });


    // ==========================
    // ERROR HANDLING
    // ==========================

    newProcess.on("error", (error) => {

        // Ignore old process
        if (currentProcess !== newProcess) {
            return;
        }

        console.log("Error playing song:", error.message);

        currentProcess = null;
        isPaused = false;
    });
}


// ==============================
// INITIAL DISPLAY
// ==============================

displaySongs();


// ==============================
// KEYBOARD INPUT
// ==============================

process.stdin.setRawMode(true);
process.stdin.setEncoding("utf8");

process.stdin.on("data", (key) => {


    // ==========================
    // MOVE UP
    // ==========================

    if (key === "\x1b[A") {

        if (selectedIndex > 0) {

            selectedIndex--;

            displaySongs();
        }
    }


    // ==========================
    // MOVE DOWN
    // ==========================

    if (key === "\x1b[B") {

        if (selectedIndex < songs.length - 1) {

            selectedIndex++;

            displaySongs();
        }
    }


    // ==========================
    // PLAY
    // ==========================

    if (key === "\r") {

        playSong();
    }


// ==========================
// PAUSE / RESUME
// ==========================

if (key === " ") {

    if (isPaused === false) {

        if (currentProcess) {
            currentProcess.kill("SIGTERM");

            currentProcess = null;
            isPaused = true;

            console.log("\n⏸ Paused");
        }

    } else {

        isPaused = false;
        playSong();

        console.log("\n▶ Resumed");
    }
}


    // ==========================
    // STOP
    // ==========================

    if (key === "s") {

        if (currentProcess) {

            currentProcess.kill("SIGTERM");

            currentProcess = null;

            isPaused = false;

            console.log("\n⏹ Stopped");
        }
    }


    // ==========================
    // NEXT
    // ==========================

    if (key === "n") {

        if (selectedIndex < songs.length - 1) {

            selectedIndex++;

            displaySongs();

            playSong();
        }
    }


    // ==========================
    // PREVIOUS
    // ==========================

    if (key === "p") {

        if (selectedIndex > 0) {

            selectedIndex--;

            displaySongs();

            playSong();
        }
    }


    // ==========================
    // QUIT
    // ==========================

    if (key === "q") {

        if (currentProcess) {

            currentProcess.kill("SIGTERM");
        }

        process.stdin.setRawMode(false);

        process.exit(0);
    }
});


// ==============================
// CTRL + C
// ==============================

process.on("SIGINT", () => {

    if (currentProcess) {

        currentProcess.kill("SIGTERM");
    }

    process.stdin.setRawMode(false);

    process.exit(0);
});

