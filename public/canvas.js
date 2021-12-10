// const { Socket } = require("engine.io");

let canvas = document.querySelector("canvas");
canvas.height = window.innerHeight -30 ;
canvas.width = window.innerWidth + 10;

let pencilColorCont = document.querySelectorAll(".pencil-color");
let pencilWidth = document.querySelector(".pencil-width");
let eraserWidth = document.querySelector(".erase-width");

let undo = document.querySelector(".undo");
let redo = document.querySelector(".redo");

///for pen and eraser range
let penColor = "red";
let eraserColor = "white"
let penWidth = pencilWidth.value;
let eraseWid = eraserWidth.value;

//undo redo tracker
let undoRedoTracker = []; // data
let track = 0; 

let mouseDown = false;
//API
let tool = canvas.getContext("2d");
tool.strokeStyle = penColor;
tool.lineWidth = penWidth;

// mousedown -> start new path ,movemove -> path fill (graphics)
canvas.addEventListener("mousedown",function(e){
    mouseDown = true;
    // beginPath({
    //     x : e.clientX,
    //     y : e.clientY
    // })

    let data = {
        x : e.clientX,
        y : e.clientY
    }
    socket.emit("beginPaths",data)
})

canvas.addEventListener("mousemove",function(e){
    if(mouseDown){
        let data = {
            x : e.clientX,
            y : e.clientY,
            color : eraserFlag ? eraserColor : penColor,
            width : eraserFlag ? eraseWid : penWidth
        }
        socket.emit("drawStroke",data);
    }
    // drawPath({
    //     x : e.clientX,
    //     y : e.clientY,
    //     color : eraserFlag ? eraserColor : penColor,
    //     width : eraserFlag ? eraseWid : penWidth
    // })
})

canvas.addEventListener("mouseup",function(e){
    mouseDown = false;
    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length-1;
})

// for undo
undo.addEventListener("click",function(e) {
    if(track > 0)track--;
    //track action
    let data = {
        trackValue: track,
        undoRedoTracker
    }
    socket.emit("redoUndo",data)
})

// for redo
redo.addEventListener("click",function(e){
    if(track < undoRedoTracker.length-1){
        track++;
    }
    //track action
    let data = {
        trackValue: track,
        undoRedoTracker
    }
    socket.emit("redoUndo",data)
})

function undoRedoCanvas(trackObj){
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;
    let urls = undoRedoTracker[track];
    let img = new Image(); // new image refernce element
    img.onload = (e) =>{
        tool.drawImage(img,0,0,canvas.width,canvas.height);
    }
    img.setAttribute("src",urls);
}

function beginPath(strokeObj){
    tool.beginPath();
    tool.moveTo(strokeObj.x,strokeObj.y);
}

function drawPath(strokeObj){
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x,strokeObj.y);
    tool.stroke();
}

pencilColorCont.forEach((colorEle) => {
    colorEle.addEventListener("click",function(e){
        let color = colorEle.classList[0];
        penColor = color;
        tool.strokeStyle = penColor;
    })
})

pencilWidth.addEventListener("change",function(e){
    penWidth = pencilWidth.value;
    tool.lineWidth = penWidth;
})

eraserWidth.addEventListener("change",function(e){
    eraseWid = eraserWidth.value;
    tool.lineWidth = eraseWid;
})

eraser.addEventListener("click",function(e){
    if(eraserFlag){
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth;
    }else{
        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth;
    }
})

download.addEventListener("click",function(e){
    let url = canvas.toDataURL();
    let a  = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
})

socket.on("beginPaths",(data)=>{
    // data -> data from server
    beginPath(data);
})

socket.on("drawStroke",(data)=>{
    // data -> data from server
    drawPath(data);
})

socket.on("redoUndo",(data)=>{
    // data -> data from server
    undoRedoCanvas(data);
})
