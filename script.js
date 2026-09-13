const note = document.querySelector(".note");
const dragBar = note.querySelector(".drag-bar");
const noteText = note.querySelector("textarea");

let isDragging = false;

let dragStartVals = { x: null, y: null, left: null, top: null };
let resizeStartVals = { width: noteText.getBoundingClientRect().width, height: noteText.getBoundingClientRect().height };

dragBar.addEventListener("pointerdown", event => {
    // Force the bar to keep tracking the event even if it moves outside the bar's bounds
    dragBar.setPointerCapture(event.pointerId);
    isDragging = true;

    dragStartVals = { x: event.clientX, y: event.clientY, left: note.offsetLeft, top: note.offsetTop};
});

dragBar.addEventListener("pointermove", event => {
    if (!isDragging) return;

    const deltaX = event.clientX - dragStartVals.x;
    const deltaY = event.clientY - dragStartVals.y;

    const newLeft = Math.max(0, Math.min(dragStartVals.left + deltaX, window.innerWidth - note.offsetWidth));
    const newTop = Math.max(0, Math.min(dragStartVals.top + deltaY, window.innerHeight - note.offsetHeight));

    // Update position on screen
    note.style.left = `${newLeft}px`;
    note.style.top = `${newTop}px`;

    // Send position to CSS to force browser to adhere to boundary constraints
    noteText.style.setProperty("--left-pos", `${noteText.getBoundingClientRect().left}px`);
    noteText.style.setProperty("--top-pos", `${noteText.getBoundingClientRect().top}px`);
});

function stopDragging(event) {
    dragBar.releasePointerCapture(event.pointerId);
    isDragging = false;

    // Store original width and height in case the window is resized
    resizeStartVals.width = noteText.getBoundingClientRect().width;
    resizeStartVals.height = noteText.getBoundingClientRect().height;
}

dragBar.addEventListener("pointerup", stopDragging);
dragBar.addEventListener("pointercancel", stopDragging);

const textareaSizeSyncer = new ResizeObserver(entries => {
    for (let entry of entries) {
        // Normalize the requested inline dimensions to match the calculated CSS dimensions
        // This prevents the browser from using the inaccurate inline dimensions when pulling the textarea back from the border
        const inlineStyle = entry.target.style;
        const computedStyle = window.getComputedStyle(entry.target);

        if (inlineStyle.width !== computedStyle.width)  inlineStyle.width = computedStyle.width;
        if (inlineStyle.height !== computedStyle.height) inlineStyle.height = computedStyle.height;

        // Store new width and height if the textarea is not actively being resized by the window
        // This prevents the note from continuing to shrink while the window is resized
        if (noteText.getBoundingClientRect().right < window.innerWidth) resizeStartVals.width = noteText.getBoundingClientRect().width;
        if (noteText.getBoundingClientRect().bottom < window.innerHeight) resizeStartVals.height = noteText.getBoundingClientRect().height;
    }
});

textareaSizeSyncer.observe(noteText);

window.addEventListener("resize", event => {
    if (note.getBoundingClientRect().right >= window.innerWidth) {
        const newLeft = Math.max(0, window.innerWidth - resizeStartVals.width);

        note.style.left = `${newLeft}px`;
        noteText.style.setProperty("--left-pos", `${newLeft}px`);
        noteText.style.width = `${resizeStartVals.width}px`;
    }

    if (note.getBoundingClientRect().bottom >= window.innerHeight) {
        const newTop = Math.max(0, window.innerHeight - resizeStartVals.height - dragBar.getBoundingClientRect().height);

        note.style.top = `${newTop}px`;
        noteText.style.setProperty("--top-pos", `${newTop}px`);
        noteText.style.height = `${resizeStartVals.height}px`;
    }
});