import http from "http";
import express from "express";
import SocketIO from 'socket.io';
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
const io = SocketIO(httpServer);

io.on("connection",(socket)=>{
    socket["nickname"] = "annonymous";
    socket.onAny((e)=>{
        console.log(io.sockets.adapter);
        console.log(e);
    });
    socket.on("enter_room",(roomname, showRoom)=>{
        socket.join(roomname);
        showRoom();
        socket.to(roomname).emit("welcome",socket.nickname);
    });
    socket.on("disconnecting",()=>{
        socket.rooms.forEach(room => {
            socket.to(room).emit("left",socket.nickname);
        });
    });
    socket.on("new_message",(roomname,msg, done)=>{
        socket.to(roomname).emit("new_message",`${socket.nickname} : ${msg}`);
        done();
    });
    socket.on("nickname",(nickname)=>{
        socket["nickname"] = nickname;
    })
});

httpServer.listen(3000, handleListen);
