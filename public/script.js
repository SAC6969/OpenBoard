let optionsCont = document.querySelector(".option-cont");
let optionFlag = true;
let toolsCont = document.querySelector(".tools-cont");
let pencilTool = document.querySelector(".pencil-tool");
let pencilFlag = false;
let eraserTool = document.querySelector(".erase-tool");
let eraserFlag = false;

let sticky = document.querySelector(".sticky-note");
let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
let upload = document.querySelector(".upload");
let download = document.querySelector(".download");

optionsCont.addEventListener("click", function (e) {
    optionFlag = !optionFlag;
    if (optionFlag) {
        openTool();
    } else {
        closeTool();
    }
})

function openTool() {
    let iconElem = optionsCont.children[0];
    iconElem.classList.remove("fa-times");
    iconElem.classList.add("fa-bars");
    toolsCont.style.display = "flex";
}

function closeTool() {
    let iconElem = optionsCont.children[0];
    iconElem.classList.add("fa-times");
    iconElem.classList.remove("fa-bars");
    toolsCont.style.display = "none";
    pencilTool.style.display = "none";
    eraserTool.style.display = "none";
}

pencil.addEventListener("click", function (e) {
    // true show pencilTool 
    pencilFlag = !pencilFlag;
    if (pencilFlag) {
        pencilTool.style.display = "block";
    } else {
        pencilTool.style.display = "none";
    }
})

eraser.addEventListener("click", function (e) {
    // true show pencilTool 
    eraserFlag = !eraserFlag;
    if (eraserFlag) {
        eraserTool.style.display = "flex";
    } else {
        eraserTool.style.display = "none";
    }
})

upload.addEventListener("click", function (e) {
    // open file explorer 
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", function (e) {
        let file = input.files[0];
        let url = URL.createObjectURL(file);

        let stickyTemplateHTml = `        
        <div class="header-cont">
            <div class="minimize"></div>
            <div class="remove"></div>
        </div>
        <div class="note-cont">
            <img src="${url}" />
        </div>`;
        createStricky(stickyTemplateHTml);
    })
})

sticky.addEventListener("click", function (e) {
    let stickyTemplateHTml = `        
    <div class="header-cont">
        <div class="minimize"></div>
        <div class="remove"></div>
    </div>
    <div class="note-cont">
        <textarea spellcheck="false"></textarea>
    </div>`;
    createStricky(stickyTemplateHTml);
})

function createStricky(stickyTemplate) {
    let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class", "sticky-cont");
    stickyCont.innerHTML = stickyTemplate;
    document.body.appendChild(stickyCont);

    let minimize = stickyCont.querySelector(".minimize");
    let remove = stickyCont.querySelector(".remove");
    noteAction(minimize, remove, stickyCont);
    stickyCont.onmousedown = function (event) {
        dragAnddrop(stickyCont, event);
    };
    stickyCont.ondragstart = function () {
        return false;
    };
}

function noteAction(minimize, remove, element) {
    remove.addEventListener("click", function (e) {
        element.remove();
    })
    minimize.addEventListener("click", function (e) {
        let noteCont = element.querySelector(".note-cont")
        let display = getComputedStyle(noteCont).getPropertyValue("display");
        if (display == "none") noteCont.style.display = "block";
        else noteCont.style.display = "none";
    })
}

function dragAnddrop(element, event) {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    element.style.position = 'absolute';
    element.style.zIndex = 1000;

    moveAt(event.pageX, event.pageY);

    // moves the ball at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    // move the ball on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // drop the ball, remove unneeded handlers
    element.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };

}