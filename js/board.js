// Handle draggable items

const draggableElements = document.querySelectorAll('.task-item');
draggableElements.forEach(elem => {
    elem.setAttribute('draggable', true);
    elem.addEventListener('dragstart', dragStart);
    elem.addEventListener('dragend', dragEnd);
});

// Handle droppable items

const droppableElements = document.querySelectorAll('.item-column');
droppableElements.forEach(elem => {
    elem.addEventListener('dragover', dragOver);
    elem.addEventListener('dragenter', dragEnter);
    elem.addEventListener('dragleave', dragLeave);
    elem.addEventListener('drop', drop);
});

// Drag & Drop function

// Dragged Item

function dragStart(event) {
    dragged = event.target;
    event.target.style.opacity = .5;
}

function dragEnd(event) {
    event.target.style.opacity = '';
}

// Drop Target

function dragEnter(event) {
    let placeholder = dragged;
    if (event.target.className == 'item-column') {
        event.target.prepend(placeholder);
    }
}

function dragLeave(event) {
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    let node = event.target;
    while (node.className != 'item-column') {
        node = node.parentNode;
    }
    dragged.parentNode.removeChild(dragged);
    node.prepend(dragged);
    node.style.background = '';
    notification.MaterialSnackbar.showSnackbar(
        {
          message: 'Task moved'
        }
      );
}

// Success message

var notification = document.querySelector('.mdl-js-snackbar');
notification.MaterialSnackbar.showSnackbar(
  {
    message: 'Task moved'
  }
);

/* More drag events

elem.addEventListener('dragstart', function);
elem.addEventListener('dragenter', function);
elem.addEventListener('dragover', function);
elem.addEventListener('dragleave', function);
elem.addEventListener('dragend', function);
elem.addEventListener('drop', function);

*/