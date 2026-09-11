const note = document.querySelector(".note");
const dragBar = note.querySelector(".drag-bar");
const noteText = note.querySelector("textarea");

let isDragging = false;

let startVals = { x: null, y: null, left: null, top: null };

dragBar.addEventListener("pointerdown", event => {
    // Force the bar to keep tracking the event even if it moves outside the bar's bounds
    dragBar.setPointerCapture(event.pointerId);
    isDragging = true;

    startVals = { x: event.clientX, y: event.clientY, left: note.offsetLeft, top: note.offsetTop};
});

dragBar.addEventListener("pointermove", event => {
    if (!isDragging) return;

    const deltaX = event.clientX - startVals.x;
    const deltaY = event.clientY - startVals.y;

    const newLeft = Math.max(0, Math.min(startVals.left + deltaX, window.innerWidth - note.offsetWidth));
    const newTop = Math.max(0, Math.min(startVals.top + deltaY, window.innerHeight - note.offsetHeight));

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
    }
});

textareaSizeSyncer.observe(noteText);