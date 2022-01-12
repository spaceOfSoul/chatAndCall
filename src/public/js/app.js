const socket = io();

const selectRoom = document.querySelector("#welcom");
const roomName_form = selectRoom.querySelector("form");
const inRoom = document.getElementById("room");

inRoom.hidden = true;

let roomName;

function handleMessageSubmit(e){
    e.preventDefault();
    const input = inRoom.querySelector("input");
    const val = input.value;
    socket.emit("new_message",roomName, val, ()=>{
        addMessage(`You : ${val}`);
    });
    input.value = "";
}

function showRoom(){
    selectRoom.hidden = true;
    inRoom.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `ROOM : ${roomName}`;

    const form = inRoom.querySelector("form");
    form.addEventListener("submit",handleMessageSubmit);
}

function addMessage(msg){
    const ul = inRoom.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = msg;
    ul.appendChild(li);
}

roomName_form.addEventListener("submit",(e)=>{
    e.preventDefault();
    const input = roomName_form.querySelector("input");
    socket.emit("enter_room",input.value,showRoom);
    roomName = input.value;
    input.value = "";
});

socket.on("welcome",()=>{
    addMessage("someone Joined");
});

socket.on("left",()=>{
    addMessage("someone left");
});
socket.on("new_message",addMessage);