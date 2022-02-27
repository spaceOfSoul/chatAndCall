const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasList = document.getElementById("cameras");

let mystream;
let muted = false;
let cameraOff = false;

async function getCamera(){
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter((device) => device.kind === "videoinput");
        console.log(cameras);
        cameras.forEach((cam) => {
            const option = document.createElement("option");
            option.value = cam.deviceId;
            option.innerText = cam.label;
            camerasList.appendChild(option);
        });
    } catch (error) {
        console.log(error);
    }
}

async function getMedia(){
    try{
        mystream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        })
        myFace.srcObject = mystream;
        await getCamera();
    }catch(e){
        console.log(e);
    }
}

getMedia();

function handleMuteButn(){
    mystream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
    });
    if(!muted){
        muteBtn.innerText = "unmute";
        muted = true;
    }else{
        muteBtn.innerText = "Mute";
        muted = false;
    }
}
function handleCameraButn(){
    mystream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
    });
    if(!muted){
        cameraBtn.innerText = "CameraOn";
        cameraOff = true;
    }else{
        cameraBtn.innerText = "CameraOff";
        cameraOff = false;
    }
}

muteBtn.addEventListener("click", handleMuteButn);
cameraBtn.addEventListener("click", handleCameraButn);