const newText = document.querySelector(".text");
const newDiv = document.querySelector(".new");
const newAdd = document.querySelector(".add");
const mainList = document.querySelector(".lists");
const lastRow = document.querySelector(".last-row");
const totalItems = document.querySelector(".items");
const clearCompleted = document.querySelector(".clear");
const nav = document.querySelectorAll(".filter > *");
const theme = document.querySelector(".app-theme");

let originalText = "Create a new todo...";

// event to input a new to do item

newText.addEventListener("click", e => {
    if (newText.innerText === originalText) {
        newText.classList.add("cursor-text");
        newText.innerText = "";
    }
    newText.addEventListener("keydown", e => {
        if (e.keyCode === 13) {
            createItem(newText.innerText);
            e.preventDefault();
            newText.blur();
        }
    })

})

// event to add a new to do item

newAdd.addEventListener("click", () => {
    createItem(newText.innerText);
})

function createItem(todoItem) {
    if (newText.innerText !== originalText) {
        if (newText.innerText !== "") {
            let addingList = document.createElement("div");
            let circle = document.createElement("span");
            let addText = document.createElement("span");
            let cross = document.createElement("img");

            addText.innerText = todoItem;
            cross.setAttribute("src", "images/icon-cross.svg");
            addingList.setAttribute("draggable", true);

            circle.classList.add("circle");
            addText.classList.add("flex-basis");
            addingList.classList.add("list");
            cross.classList.add("delete");

            addingList.insertAdjacentElement('afterbegin', circle);
            addingList.insertAdjacentElement('beforeend', addText);
            addingList.insertAdjacentElement('beforeend', cross);
            lastRow.insertAdjacentElement('beforebegin', addingList);

            updateNumber();

            let current = document.querySelector(".current").classList[0];
            filter(current);
        }
        newText.innerText = originalText;
    }
}

// events inside main lists area to delete a list or mark as completed

mainList.addEventListener("click", e => {
    let path = e.path;
    deleteItem(path);
    completedItem(path);
    let current = document.querySelector(".current").classList[0];
    filter(current);
    updateNumber();
})

function deleteItem(mainPath) {
    if (mainPath[0].classList.contains("delete")) {
        mainPath[1].remove();
    }
}

function completedItem(mainPath) {
    if (mainPath[0].classList.contains("circle")) {
        mainPath[0].classList.toggle("completed");
        mainPath[1].classList.toggle("complete");
        mainPath[1].children[1].classList.toggle("strikethrough");
    }
}

// event to use the navigations (all, active, completed)

for (let links of nav) {
    links.addEventListener("click", (e) => {
        let path = e.path;
        let pathClass = path[0].classList[0];
        path[0].classList.add("current");
        filter(pathClass);
        for (let i = 0; i < path[1].children.length; i++) {
            if (path[1].children[i] !== path[0]) {
                path[1].children[i].classList.remove("current");
            }
        }
    })
}

function filter(x) {
    let mlChildren = document.querySelectorAll(".list");
    mlChildren.forEach(el => {
        if (x === "active" && el.classList.contains("complete")) {
            el.classList.add("display-off");
        }
        else if (x === "done" && !el.classList.contains("complete")) {
            el.classList.add("display-off");
        }
        else {
            el.classList.remove("display-off");
        }
    })
}

//event to clear all completed items

clearCompleted.addEventListener("click", clearComplete);

function clearComplete() {
    let mlChildren = mainList.children;
    let len = mlChildren.length - 1;
    for (let x = len; x >= 0; x--) {
        if (mlChildren[x].classList.contains("complete")) {
            mlChildren[x].remove();
        };
    };
}

function updateNumber() {
    let mlChildren = document.querySelectorAll(".list");
    let i = 0;
    mlChildren.forEach(el => {
        el.classList.add("padding-border");
        if (!el.classList.contains("complete")) {
            i++
        }
    })

    if (i === 1) {
        totalItems.innerText = "1 item left";
    }
    else if (i > 1) {
        totalItems.innerText = `${i} items left`;
    }
    else {
        totalItems.innerText = "No items";
    }
}

// event handlers for exiting the new item text area

window.onclick = function (e) {
    if (newText.innerText !== originalText) {
        let target = e.target;
        let div = [...newDiv.children, newDiv];
        if (div.every((el) => el !== target)) {
            newText.textContent = originalText;
        }
    }
}

document.onkeydown = function (e) {
    let evt = e || window.event;
    if (evt.keyCode === 27) {
        newText.blur();
    }
}

// drag and drop desktop 

mainList.addEventListener("dragstart", e => {
    let dragged = e.target;
    dragged.classList.add("dragging")
})

mainList.addEventListener("dragend", e => {
    let dragged = e.target;
    dragged.classList.remove("dragging")
})

mainList.addEventListener("dragover", e => {
    e.preventDefault();
    const afterElement = getDragAfterElement(e.clientY)
    const draggable = document.querySelector('.dragging')

    if (afterElement) {
        mainList.insertBefore(draggable, afterElement)
    }
    else {
        mainList.insertBefore(draggable, lastRow)
    }
});

// drag and drop mobile aka touch events

mainList.addEventListener("touchstart", e => {
    if (e.target.localName === "span") {
        let dragged = e.target.parentElement;
        dragged.classList.add("dragging")
    }
})

mainList.addEventListener("touchend", e => {
    if (e.target.localName === "span") {
        let dragged = e.target.parentElement;
        dragged.classList.remove("dragging")
    }
})

mainList.addEventListener("touchmove", e => {
    e.preventDefault();
    const afterElement = getDragAfterElement(e.targetTouches[0].pageY)
    const draggable = document.querySelector('.dragging')

    if (afterElement) {
        mainList.insertBefore(draggable, afterElement)
    }
    else {
        mainList.insertBefore(draggable, lastRow)
    }
});

function getDragAfterElement(y) {
    const draggableElements = [...document.querySelectorAll('.list:not(.dragging)')]

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height / 2
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child }
        } else {
            return closest
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element
}

// event to change app theme

let varTheme = {
    background: ["hsl(235, 21%, 11%)", "hsl(236, 33%, 92%)"],
    items: ["hsl(235, 24%, 19%)", "hsl(0, 0%, 98%)"],
    font: ["hsl(234, 39%, 85%)", "hsl(235, 19%, 35%)"],
    secondaryFont: ["hsl(234, 11%, 52%)", "hsl(236, 9%, 61%)"],
    thirdFont: ["hsl(236, 33%, 92%)", "hsl(236, 33%, 92%)"],
    fourthFont: ["hsl(233, 14%, 35%)", "hsl(233, 11%, 84%)"],
    border: ["hsl(233, 14%, 35%)", "hsl(236, 33%, 92%)"],
    mobileBg: ["url(images/bg-mobile-dark.jpg)", "url(images/bg-mobile-light.jpg)"],
    desktopBg: ["url(images/bg-desktop-dark.jpg)", "url(images/bg-desktop-light.jpg)"]

}

theme.addEventListener("click", () => {
    for (let vars of Object.keys(varTheme)) {
        if (theme.classList.contains("dark")) {
            document.documentElement.style.setProperty(`--${vars}`, varTheme[vars][1]);
            theme.setAttribute("src", "images/icon-moon.svg")
        }
        else {
            document.documentElement.style.setProperty(`--${vars}`, varTheme[vars][0]);
            theme.setAttribute("src", "images/icon-sun.svg")
        }
    }
    if (theme.getAttribute("src") === "images/icon-moon.svg") {
        theme.classList.remove("dark")
    }
    else {
        theme.classList.add("dark")
    }
})

// event to change nav panel from below the main list 
// to the last row of the main list 

const navResize = function () {
    if (document.body.offsetWidth >= 700) {
        let navPanel = document.querySelector(".filter");
        let donePanel = document.querySelector(".done");
        lastRow.insertBefore(navPanel, clearCompleted);
    }

    if (document.body.offsetWidth < 700) {
        let navPanel = document.querySelector(".filter");
        let paraPanel = document.querySelector("p");
        document.body.insertBefore(navPanel, paraPanel);
    }
}

window.onresize = navResize;
window.onload = navResize;