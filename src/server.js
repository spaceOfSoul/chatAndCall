import http from "http";
import express from "express";
import {Server, Socket} from 'socket.io';
const { instrument } = require("@socket.io/admin-ui");
import { publicDecrypt } from "crypto";

const app = express();

const app = express();
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);

const wsServer = SocketIO(httpServer);

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);