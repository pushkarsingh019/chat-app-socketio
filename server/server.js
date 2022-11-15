const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const PORT = process.env.PORT || 8080

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors : {
		origin : ["https://chat-app-pushkar.vercel.app/", "http://localhost:3000"],
		methods : ["GET", "POST"],
}
});

// variable to increment messageId.
let nextId = 0;

io.on("connection", (socket) => {
	console.log(`user connected : ${socket.id} `);

	// when the user joins the room
	socket.on("joinRoom", (roomId) => {
		console.log(`user with Id : ${socket.id} joined the room : ${roomId}`)
	})

	// when error happens
	socket.on("error", (err) => {
		console.log("error on the server -> " + err);
	})

	// listening to the chat 
	socket.on("sendMessage", (data) => {
		// console.log(data);
		// socket.emit("get_message", data);
		data["id"] = nextId;
		socket.broadcast.emit("get_message", data);
		nextId = nextId + 1;
	})

	// when the user disconnects
	socket.on("disconnect", () => {
		console.log(`user disconnected -> ${socket.id}`)
	})
})

server.listen(PORT, console.log("server up and running"));


