import http from "http";
import express from "express";
import {Server} from 'socket.io';
const { instrument } = require("@socket.io/admin-ui");
import { publicDecrypt } from "crypto";
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (_,res) =>{
    res.redirect("/");
})

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
      origin: ["https://admin.socket.io"],
      credentials: true
    }
  });

instrument(io, {
    auth: false
});

function publicRoom(){
    const {
        sockets:{
            adapter: {sids, rooms},
        },
    } = io;
    const publicRooms = [];
    rooms.forEach((_,key) =>{
        if(sids.get(key) === undefined){
            publicRooms.push(key);
        }
    })
    return publicRooms;
}

function countRoom(roomName){
    return io.sockets.adapter.rooms.get(roomName)?.size;
}

io.on("connection",(socket)=>{
    socket["nickname"] = "annonymous";
    socket.onAny((e)=>{
        console.log(e);
    });
    socket.on("browserOn",()=>io.sockets.emit("room_change",publicRoom()));
    socket.on("enter_room",(roomname, showRoom)=>{
        socket.join(roomname);
        showRoom();
        socket.to(roomname).emit("welcome",socket.nickname,countRoom(roomname));
        io.sockets.emit("room_change",publicRoom());
    });
    socket.on("disconnecting",()=>{
        socket.rooms.forEach(room => {
            socket.to(room).emit("left",socket.nickname,countRoom(room)-1);
        });
    });
    socket.on("disconnect",()=>{
        io.sockets.emit("room_change",publicRoom());
    })
    socket.on("new_message",(roomname,msg, done)=>{
        socket.to(roomname).emit("new_message",`${socket.nickname} : ${msg}`);
        done();
    });
    socket.on("nickname",(nickname)=>{
        socket["nickname"] = nickname;
    })
});

httpServer.listen(3000, handleListen);
