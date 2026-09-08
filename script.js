const note = document.querySelector(".note");
const dragBar = note.querySelector(".drag-bar");

let isDragging = false;
 
let canMoveOnX = true, canMoveOnY = true;
let xUnlockPos = null, yUnlockPos = null;

dragBar.addEventListener("pointerdown", event => {
    // Force the bar to keep tracking the event even if it moves outside the bar's bounds
    dragBar.setPointerCapture(event.pointerId);
    isDragging = true;
});

dragBar.addEventListener("pointermove", event => {
    if (!isDragging) return;

    let proposedLeft = note.offsetLeft + event.movementX;
    let proposedTop = note.offsetTop + event.movementY;

    if (canMoveOnX) {
        if (proposedLeft < 0) {
            canMoveOnX = false;
            xUnlockPos = event.clientX;
            proposedLeft = 0;
        }
        else if (proposedLeft > window.innerWidth - note.getBoundingClientRect().width) {
            canMoveOnX = false;
            xUnlockPos = event.clientX;
            proposedLeft = window.innerWidth - note.getBoundingClientRect().width;
        }

        note.style.left = `${proposedLeft}px`;
    }
    else if (
        (xUnlockPos < window.innerWidth / 2 && event.clientX >= xUnlockPos) ||
        (xUnlockPos > window.innerWidth / 2 && event.clientX <= xUnlockPos)
    ) {
        canMoveOnX = true;
    }

    if (canMoveOnY) {
        if (proposedTop < 0) {
            canMoveOnY = false;
            yUnlockPos = event.clientY;
            proposedTop = 0;
        }
        else if (proposedTop > window.innerHeight - note.getBoundingClientRect().height) {
            canMoveOnY = false;
            yUnlockPos = event.clientY;
            proposedTop = window.innerHeight - note.getBoundingClientRect().height;
        }

        note.style.top = `${proposedTop}px`;
    }
    else if (
        (yUnlockPos < window.innerHeight / 2 && event.clientY >= yUnlockPos) ||
        (yUnlockPos > window.innerHeight / 2 && event.clientY <= yUnlockPos)
    ) {
        canMoveOnY = true;
    }
})

function stopDragging(event) {
    dragBar.releasePointerCapture(event.pointerId);
    isDragging = false;
}

dragBar.addEventListener("pointerup", stopDragging);
dragBar.addEventListener("pointercancel", stopDragging);