const lblSpeed = document.getElementById("lblSpeed");
const lblVolume = document.getElementById("lblVolume");

let cnvWidth, cnvHeight;
let video, song, poseNet;
let isPlaying = false;
let volume = 0;
let speed = 0;

let guideLine;

const wrists = {
    left: {
        x: 0,
        y: 0
    },
    right: {
        x: 0,
        y: 0
    }
}

function preload() {
    // cnvWidth = windowWidth - 440;
    // cnvHeight = cnvWidth * 3 / 4;
    cnvWidth = 640; // a tela precisa ter a mesma resolução da camera
    cnvHeight = cnvWidth * 3 / 4;
    // console.log(cnvWidth, cnvHeight);

    song = loadSound("The_Score.mp3");
}

function setup() {
    var canvas = createCanvas(cnvWidth, cnvHeight);
    canvas.center();

    video = createCapture(VIDEO);
    video.hide();

    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses);

    guideLine = height / 2;

    mudaVolume();
    mudaVelocidade();
}

function draw() {
    image(video, 0, 0, cnvWidth, cnvHeight);
    lblSpeed.textContent = speed;

    const radius = 30;

    stroke("#000");

    fill("#008000");
    circle(wrists.left.x, wrists.left.y, radius);
    mudaVolume();

    fill("#FF0000");
    circle(wrists.right.x, wrists.right.y, radius);
    mudaVelocidade();
}

function play() {
    let btn = document.getElementById("play");
    if (!isPlaying) {
        song.play();

        isPlaying = true;
        btn.innerHTML = '<i class="fa-solid fa-stop"></i>';
        btn.className = btn.className.replaceAll("success", "danger");
    } else {
        song.stop();

        isPlaying = false;
        btn.innerHTML = '<i class="fa-solid fa-play"></i>';
        btn.className = btn.className.replaceAll("danger", "success");
    }
}

function modelLoaded() {
    console.log("PoseNet is initialized");
}

function gotPoses(results) {
    // console.log(results);
    if (results.length > 0) {
        wrists.left = {
            x: round(results[0].pose.leftWrist.x),
            y: round(results[0].pose.leftWrist.y),
        }
        wrists.right = {
            x: round(results[0].pose.rightWrist.x),
            y: round(results[0].pose.rightWrist.y),
        }
        // console.log(wrists);
    }
}

function mudaVolume() {
    if (isPlaying) {
        volume = (height - wrists.left.y) / height;
        volume = constrain(volume, 0, 1);
        song.setVolume(volume);
    } else {
        volume = 0;
    }
    lblVolume.textContent = round(volume * 100);
}

function mudaVelocidade() {
    if (isPlaying) {
        speed = (wrists.right.y * 5 / height) - 2.5;
        speed = round(speed, 1);
        speed = constrain(speed, -2.5, 2.5);
        song.rate(speed);
    } else {
        speed = 1;
    }
    lblSpeed.textContent = speed;
}