const app = require("express")();
const dotenv = require("dotenv");
const { chats } = require("./data/data");

let cors = require("cors");
app.use(cors());

dotenv.config();

app.get("/", (req, res) => {
    res.send("hi")
})

app.get("/api/chat", (req, res) => {
    res.send(chats)
})

app.get("/api/chat/:id", (req, res) => {
    const singleChat = chats.find(chat => chat._id === req.params.id);
    res.send(singleChat)
})

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server starts on port ${PORT}`));