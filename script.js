const note = document.querySelector(".note");
const dragBar = note.querySelector(".drag-bar");

let isDragging = false;

dragBar.addEventListener("pointerdown", event => {
    // Force the bar to keep tracking the event even if it moves outside the bar's bounds
    dragBar.setPointerCapture(event.pointerId);
    isDragging = true;
});

dragBar.addEventListener("pointermove", event => {
    if (!isDragging) return;

    note.style.left = `${note.offsetLeft + event.movementX}px`;
    note.style.top = `${note.offsetTop + event.movementY}px`;
})

function stopDragging(event) {
    dragBar.releasePointerCapture(event.pointerId);
    isDragging = false;
}

dragBar.addEventListener("pointerup", stopDragging);
dragBar.addEventListener("pointercancel", stopDragging);