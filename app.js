const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 3000;
const postRouter = require("./routes/posts.js");
const commentRouter = require("./routes/comments.js");
const db = mongoose.connection;
mongoose.set("strictQuery", true);

mongoose.connect("mongodb://localhost/parfait");
// db.on("error", (err) => console.log(err));
// db.once("open", () => console.log());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/parfait", postRouter);
app.use("/comment", commentRouter);

app.listen(port, () => console.log("server started"));
