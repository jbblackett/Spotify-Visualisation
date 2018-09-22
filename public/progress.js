var socket;

var songData;
var currentPos = 0;
var songLength;
var songName;
var songArtists;
var state = "False";
var img;

var bands = 512;

function preload() {
  font = loadFont('product-sans.ttf');
}

function setup() {
  mic = new p5.AudioIn();
  mic.start()
  fft = new p5.FFT(0.75,bands);
  fft.setInput(mic);

  createCanvas(window.innerWidth, window.innerHeight);
  textFont(font);
  textAlign(CENTER, CENTER);
  textSize(30);
  noStroke();
  imageMode(CENTER);
  rectMode(CORNERS);

  socket = io.connect('http://localhost:3000');
  socket.on('update', update);
  setInterval(updateTime, 100);
}

function update(data) {
  songData = split(data, '_');
  console.log(songData);
  songName = songData[0];
  songArtists = songData[1];
  songLength = int(songData[2]);
  currentPos = int(songData[3]);
  state = songData[4];
  img_width = int(songData[5]);
  img_height = int(songData[6]);
  img = loadImage(songData[7]);
}

function updateTime() {
  if (state == "True") {
    currentPos += 100;
  }
}

function draw() {
  background(0);
  var spacing = width/bands;
  if (songLength) {
    x = map(currentPos, 0, songLength, 0, width);
    noStroke();
    fill(0,0,255, 100);
    rect(0,0,x,height);
    fill(255,100,0);
    text(songName, width/2, height/2 - 130);
    text(songArtists, width/2, height/2 + 120);
    image(img, width/2, height/2, 200, 200);

    var spectrum = fft.analyze();
    for (var i = 0; i < spectrum.length; i++) {
      var x_bars = map(i, 0, bands, 0, width);
      var y_bars = map(spectrum[i], 0, 255, height, 0);

      stroke(218, 112, 214);
      fill(218, 112, 214);
      line(x_bars, height, x_bars, y_bars*1.4);
    }

  }



}
