const fs = require("fs");
const { spawn } = require("node:child_process");

// ==============================
// MILESTONE 1: READ SONGS
// ==============================

const songsPath = "./songs";

const songs = fs
    .readdirSync(songsPath)
    .filter((file) => file.endsWith(".mp3"));


// ==============================
// MILESTONE 3: SELECTED SONG
// ==============================

let selectedIndex = 0;


// ==============================
// DISPLAY PLAYLIST
// ==============================

function displaySongs() {

    // Clear terminal
    process.stdout.write("\x1b[2J");

    // Move cursor to top-left
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
    console.log("Q Quit");
}


// Display playlist when program starts
displaySongs();


// ==============================
// MILESTONE 2: KEYBOARD INPUT
// ==============================

process.stdin.setRawMode(true);

process.stdin.setEncoding("utf8");

process.stdin.on("data", (key) => {

    // ==========================
    // MILESTONE 3: MOVE UP
    // ==========================

    if (key === "\x1b[A") {

        if (selectedIndex > 0) {
            selectedIndex--;

            displaySongs();
        }
    }


    // ==========================
    // MILESTONE 3: MOVE DOWN
    // ==========================

    if (key === "\x1b[B") {

        if (selectedIndex < songs.length - 1) {
            selectedIndex++;

            displaySongs();
        }
    }


    // ==========================
    // MILESTONE 2: QUIT
    // ==========================

    if (key === "q") {
        process.exit(0);
    }
});