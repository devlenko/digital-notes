let noteCount = 0;

const noteGroup = document.querySelector(".note-group");
const addNoteBtn = document.getElementById("add-note-btn");

function createNote() {
    // Create and store the note and inner elements
    noteGroup.insertAdjacentHTML("beforeend", `
        <div class="note">
            <div class="drag-bar"></div>
            <textarea></textarea> 
        </div>    
    `);

    // Specify which note in the HTML to add functionality to
    const note = noteGroup.getElementsByClassName("note")[noteCount];
    const dragBar = note.querySelector(".drag-bar");
    const textarea = note.querySelector("textarea");
    noteCount++;
    bringNoteFront(note);
    
    // Define note values for dragging and resizing
    note.isDragging = false;
    note.updateStartVals = {
        x: null,
        y: null,
        left: null,
        top: null,
        width: textarea.getBoundingClientRect().width,
        height: textarea.getBoundingClientRect().height
    };
    textarea.parent = note;

    dragBar.addEventListener("pointerdown", event => {
        // Force the bar to keep tracking the event even if it moves outside the bar's bounds
        dragBar.setPointerCapture(event.pointerId);
        note.isDragging = true;

        note.updateStartVals = { 
            ...note.updateStartVals,
            x: event.clientX,
            y: event.clientY,
            left: note.offsetLeft,
            top: note.offsetTop
        };
    });

    dragBar.addEventListener("pointermove", event => {
        if (!note.isDragging) return;

        const deltaX = event.clientX - note.updateStartVals.x;
        const deltaY = event.clientY - note.updateStartVals.y;

        const newLeft = Math.max(0, Math.min(note.updateStartVals.left + deltaX, window.innerWidth - note.offsetWidth));
        const newTop = Math.max(0, Math.min(note.updateStartVals.top + deltaY, window.innerHeight - note.offsetHeight));

        // Update position on screen
        note.style.left = `${newLeft}px`;
        note.style.top = `${newTop}px`;

        // Send position to CSS to force browser to adhere to boundary constraints
        textarea.style.setProperty("--left-pos", `${textarea.getBoundingClientRect().left}px`);
        textarea.style.setProperty("--top-pos", `${textarea.getBoundingClientRect().top}px`);
    });

    function stopDragging(event) {
        dragBar.releasePointerCapture(event.pointerId);
        note.isDragging = false;

        // Store original width and height in case the window is resized
        note.updateStartVals.width = textarea.getBoundingClientRect().width;
        note.updateStartVals.height = textarea.getBoundingClientRect().height;
    }

    dragBar.addEventListener("pointerup", stopDragging);
    dragBar.addEventListener("pointercancel", stopDragging);

    note.addEventListener("pointerdown", event => bringNoteFront(note));
    
    textareaSizeSyncer.observe(textarea);
}

function bringNoteFront(note) {
    if (note.style.zIndex === "1") return;

    for (const currNote of noteGroup.getElementsByClassName("note")) {
        currNote.style.zIndex = currNote === note ? 1 : 0;
    }
}

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
        const updateStartVals = entry.target.parent.updateStartVals;
        const textareaRect = entry.target.getBoundingClientRect();

        if (textareaRect.right < window.innerWidth) updateStartVals.width = textareaRect.width;
        if (textareaRect.bottom < window.innerHeight) updateStartVals.height = textareaRect.height;
    }
});

window.addEventListener("resize", event => {
    for (const note of noteGroup.getElementsByClassName("note")) {
        const dragBar = note.querySelector(".drag-bar");
        const textarea = note.querySelector("textarea");

        if (note.getBoundingClientRect().right >= window.innerWidth) {
            const newLeft = Math.max(0, window.innerWidth - note.updateStartVals.width);

            note.style.left = `${newLeft}px`;
            textarea.style.setProperty("--left-pos", `${newLeft}px`);
            textarea.style.width = `${note.updateStartVals.width}px`;
        }

        if (note.getBoundingClientRect().bottom >= window.innerHeight) {
            const newTop = Math.max(0, window.innerHeight - note.updateStartVals.height - dragBar.getBoundingClientRect().height);

            note.style.top = `${newTop}px`;
            textarea.style.setProperty("--top-pos", `${newTop}px`);
            textarea.style.height = `${note.updateStartVals.height}px`;
        }
    }
});

addNoteBtn.addEventListener("click", event => {
    createNote();
});