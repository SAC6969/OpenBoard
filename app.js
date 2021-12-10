const express = require("express"); // access
const socket = require("socket.io");

const exp = express() //
exp.use(express.static("public"));

let port = 5000;
let server = exp.listen(port, () => {
    console.log("listening to port" + port)
})

let io = socket(server);
io.on("connection", (socket) =>{
    console.log("Made Socket connection");
    //recevied data
    socket.on("beginPaths",(data) => {
        // data -> data from frontend
        // Now transfer data to all computer
        io.sockets.emit("beginPaths",data);
    })

    socket.on("drawStroke",(data) => {
        // data -> data from frontend
        // Now transfer data to all computer
        io.sockets.emit("drawStroke",data);
    })

    socket.on("redoUndo",(data) => {
        // data -> data from frontend
        // Now transfer data to all computer
        io.sockets.emit("redoUndo",data);
    })
});
