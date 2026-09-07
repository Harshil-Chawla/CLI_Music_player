const fs = require("fs");
const { spawn } = require("node:child_process");

// Path to our songs folder
const songsPath = "./songs";

// Read all files from the songs folder
const songs = fs
    .readdirSync(songsPath)
    .filter((file) => file.endsWith(".mp3"));

// Welcome message
console.log("🎶 Welcome to Terminal Music Player 🎶\n");

// Check if there are any songs
if (songs.length === 0) {
    console.log("No MP3 files found in the songs folder.");
    process.exit(0);
}

// Display all songs
console.log("Available Songs:\n");

for (let i = 0; i < songs.length; i++) {
    const songName = songs[i].replace(".mp3", "");
    console.log(`${i + 1}. ${songName}`);
}

console.log("\n🎵 Enter the number of the song you want to play:");


// Take input from the terminal
process.stdin.on("data", (input) => {

    const userInput = Number(input.toString().trim());

    // Check whether the entered number is valid
    if (userInput < 1 || userInput > songs.length || Number.isNaN(userInput)) {
        console.log("❌ Invalid song number.");
        return;
    }

    // Get the selected song
    const selectedSong = songs[userInput - 1];

    console.log(`\n▶️ Playing: ${selectedSong.replace(".mp3", "")}`);

    // Start afplay
    const player = spawn("afplay", [`${songsPath}/${selectedSong}`]);

    // When the song finishes
    player.on("close", () => {
        console.log("\n🎵 Song finished.");
        process.exit(0);
    });
});