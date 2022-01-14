const socket = io();

const selectRoom = document.querySelector("#welcom");
const roomName_form = selectRoom.querySelector("form");
const inRoom = document.getElementById("room");

inRoom.hidden = true;

let roomName;
let nickName;

socket.emit("browserOn");

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

function refreshRoomInfo(count){
    const h3 = room.querySelector("h3");
    h3.innerText = `ROOM : ${roomName} (${count})`;
}

roomName_form.addEventListener("submit",(e)=>{
    e.preventDefault();
    const input = roomName_form.querySelector("#roomname");
    const nickInput = roomName_form.querySelector("#nickname");
    roomName = input.value;
    nickName = nickInput.value;
    socket.emit("nickname",nickName);
    socket.emit("enter_room",roomName,showRoom);
    input.value = "";
});

socket.on("welcome",(user,count)=>{
    refreshRoomInfo(count);
    addMessage(`${user} is joined!`);
});

socket.on("left",(user,count)=>{
    refreshRoomInfo(count);
    addMessage(`${user} has left.`);
});
socket.on("new_message",addMessage);

socket.on("room_change", (rooms)=>{
    const roomList = selectRoom.querySelector("ul");
    roomList.innerHTML = "";
    if(rooms.length === 0){
        return;
    }
    rooms.forEach(room => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    });
});