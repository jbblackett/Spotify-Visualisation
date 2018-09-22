console.log('Server running!');

const express = require('express');
const app = express();
const server = app.listen(3000);
const fs = require("fs");
let lastSongData = 0;

app.use(express.static('public'));

const io = require('socket.io')(server);

try {
  lastSongData = fs.readFileSync('song.csv', 'utf8');
} catch(e) {
  console.log(e, "\nCouldn't find song.txt");
}

const pollInterval = 500;
const pollTimer = setInterval(() => {
  fs.readFile('song.csv', 'utf8', (err, songData) => {
    if (!err && songData !== lastSongData) {
      //send data to clients
      console.log("Found change in song.txt. Sending to clients...");
      io.emit('update', songData);
      lastSongData = songData;
    }
  });
}, pollInterval);

io.sockets.on('connection', newConnection);

function newConnection(socket) {
  console.log("New connection: " + socket.id);
  if (lastSongData) {
    socket.emit('update', lastSongData);
  }
}

// while (true) {
//   fs.readFile('song.txt', 'utf8', function(err, data) {
//     if (err) throw err;
//     console.log(data)
//     io.sockets.emit('update', data);
//   })
