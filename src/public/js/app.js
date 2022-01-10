const messageList = document.querySelector(".messageList");
const messageForm = document.querySelector("#message");
const nickForm = document.querySelector("#nickname");

const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open",()=>{
    console.log("connect to server");
});

socket.addEventListener("message", (message)=>{
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
});

socket.addEventListener("close", ()=>{
    console.log("Disconnect from Server.");
});

messageForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const input = messageForm.querySelector("input");
    /*
    const li = document.createElement("li");
    li.innerText = `You : ${input.value}`;
    messageList.append(li);
    */
    socket.send(JSON.stringify({
        type:"new_message",
        payload: input.value
    }));
    input.value = "";
});

nickForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    const input = nickForm.querySelector("input");

    socket.send(JSON.stringify({
        type:"nickname",
        payload: input.value
    }));
});