// Handle draggable items

const draggableElements = document.querySelectorAll('.task-item');
draggableElements.forEach(elem => {
    elem.setAttribute('draggable', true);
    elem.addEventListener('dragstart', dragStart);
    //elem.addEventListener('drop', drop);
    elem.addEventListener('dragover', dragOver);
});

// Handle droppable items

const droppableElements = document.querySelectorAll('.item-column');
droppableElements.forEach(elem => {
    elem.addEventListener('dragover', dragOver);
    elem.addEventListener('drop', drop);
});

// Drag & Drop function

function dragStart(event) {
    console.log('dragging...');
    event.dataTransfer.setData("text", event.target.id);
}

function dragOver(event) {
    event.preventDefault();
    console.log(event.dataTransfer.getData("text") + ' over ' + event.target.className);
}

function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    let node = event.target;
    while (node.className != 'item-column') {
        node = node.parentNode;
    }
    node.prepend(document.getElementById(data));
}

/* More drag events

elem.addEventListener('dragstart', event);
elem.addEventListener('dragenter', event);
elem.addEventListener('dragover', event);
elem.addEventListener('dragleave', event);
elem.addEventListener('dragend', event);
elem.addEventListener('drop', event);

*/