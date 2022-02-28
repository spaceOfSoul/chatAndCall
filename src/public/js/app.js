const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasList = document.getElementById("cameras");
const maindoor = document.getElementById("maindoor");
const call = document.getElementById("call");

call.hidden = true;

let mystream;
let muted = false;
let cameraOff = false;
let roomName;
let myPeerConnection;

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

async function initCall(){
    maindoor.hidden = true;
    call.hidden = false;
    await getMedia();
    makeConnection();
}

muteBtn.addEventListener("click", handleMuteButn);
cameraBtn.addEventListener("click", handleCameraButn);
camerasList.addEventListener("input",cameraSelect);

const maindoorForm = maindoor.querySelector("form");
maindoorForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const input = maindoor.querySelector("input");
    await initCall();
    socket.emit("join_room", input.value);
    roomName = input.value;
    input.value="";
});

//socket
socket.on("welcome", async ()=>{//send
    const offer = await myPeerConnection.createOffer();
    myPeerConnection.setLocalDescription(offer);
    console.log("sent the offer");
    console.log(offer);
    socket.emit("offer", offer, roomName);
});

socket.on("offer", async(offer)=>{//reception
    myPeerConnection.setRemoteDescription(offer);
    const answer = await myPeerConnection.createAnswer();
    console.log(answer);
    myPeerConnection.setLocalDescription(answer);
    socket.emit("answer", answer, roomName);
});

socket.on("answer", (answer)=>{
    myPeerConnection.setRemoteDescription(answer);
});

//RTC
function makeConnection(){
    myPeerConnection = new RTCPeerConnection();
    mystream
        .getTracks()
        .forEach((track) => myPeerConnection.addTrack(track, mystream));
}