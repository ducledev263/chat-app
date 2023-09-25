const express = require("express");
const app = express();
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes")
const chatRoutes = require("./routes/chatRoutes")
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware")
const { createServer } = require("http")

let cors = require("cors");

app.use(cors());

dotenv.config();
connectDB(); // to connect with DB

app.use(express.json()); // to accept JSON data from frontend

app.get("/", (req, res) => {
    res.send("hello from the other side")
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

// app.all('/', function(req, res, next) {
//     res.setHeader("Access-Control-Allow-Origin", "https://chat-app-frontend-cngi.onrender.com/");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     next()
// });

const PORT = process.env.PORT || 5000

const server = createServer(app);

server.listen(PORT, console.log(`Server starts on port ${PORT}`));

const io = require("socket.io")(server, {
    pingTimeOut: 60000,
    cors: {
        origin: "https://chat-app-frontend-cngi.onrender.com/"
    },
});

io.on("connection", (socket) => {
    console.log("connected to socket.io");
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("User joined room: " + room)
    })

    socket.on("typing", (room) => {
        socket.in(room).emit("typing")
    });

    socket.on("stop typing", (room) => {
        socket.in(room).emit("stop typing")
    })

    socket.on('new message', (newMessageReceived) => {
        var chat = newMessageReceived.chat;
        if(!chat.users) return console.log("chat.users not defined");
        chat.users.forEach( user => {
            if(user._id === newMessageReceived.sender._id) {
                return;
            }

            socket.in(user._id).emit("message received", newMessageReceived)
        })
    })

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});