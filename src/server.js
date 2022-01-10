import http from "http";
import express from "express";
import WebSocket from "ws";
import { parse } from "path";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (_,res) =>{
    res.redirect("/");
})

const handleListen = () => console.log("Listening on http://localhost:3000");

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket)=>{
    sockets.push(socket);
    socket["nickname"] = "Anonnymous";
    console.log("connect to browser");
    socket.on("close", ()=>{
        console.log("Disconnect from the browser.");
    });
    socket.on("message", (message)=>{
        const parsed = JSON.parse(message);
        console.log(parsed);
        switch(parsed.type){
            case "new_message":
                sockets.forEach((aSocket)=>{
                    aSocket.send(`${socket.nickname} : ${parsed.payload.toString()}`);
                });
                break;
            case "nickname":
                socket["nickname"] = parsed.payload;
                break;
        }
    });
    socket.send("hello");
});

server.listen(3000, handleListen);

