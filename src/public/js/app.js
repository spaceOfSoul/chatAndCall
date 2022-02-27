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
        const currentCamera = mystream.getVideoTracks()[0];
        cameras.forEach((cam) => {
            const option = document.createElement("option");
            option.value = cam.deviceId;
            option.innerText = cam.label;
            if(cam.label === currentCamera){
                option.selected = true;
            }
            camerasList.appendChild(option);
        });
    } catch (error) {
        console.log(error);
    }
}

async function getMedia(cameraId){
    const initialConstrains = {
        audio: true,
        video: { facingMode: "user" },
    }
    const cameraConstrains = {
        audio: true,
        video: { deviceId: { exact: cameraId } },
    }
    try{
        mystream = await navigator.mediaDevices.getUserMedia(
            cameraId ? cameraConstrains : initialConstrains
        );
        myFace.srcObject = mystream;
        if(!cameraId)
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

async function cameraSelect(){
    await getMedia(camerasList.value);
}

muteBtn.addEventListener("click", handleMuteButn);
cameraBtn.addEventListener("click", handleCameraButn);
camerasList.addEventListener("input",cameraSelect);