const app = require("express")();
const dotenv = require("dotenv");
// const res = require("express/lib/response");
dotenv.config();

app.get("/", (req, res) => {
    res.send("hi")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server starts on port ${PORT}`));