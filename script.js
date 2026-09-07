const note = document.querySelector("textarea");

let x, y = 0;
let deltaX, deltaY = 0;

note.addEventListener("mousedown", event => {
    x = event.clientX;
    y = event.clientY;

    document.addEventListener("mousemove", moveNote);
    document.addEventListener("mouseup", () => document.removeEventListener("mousemove", moveNote));
});

function moveNote(event) {
    let newX = event.clientX, newY = event.clientY;

    deltaX = newX - x;
    deltaY = newY - y;
    x = newX;
    y = newY;

    note.style.left = (note.offsetLeft + deltaX) + "px";
    note.style.top = (note.offsetTop + deltaY) + "px";
}