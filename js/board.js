/*                       */
/* DB read/write section */
/*                       */

/**
 * Watch DB for changes and trigger a handler upon recieving a change
 * 
 */

db.collection('tasks').where('position', 'in', ['todo', 'inprogress', 'testing', 'done'])
    .onSnapshot(function (snapshot) {
        snapshot.docChanges().forEach(function (change) {
            changeHandler(change);
        });
    });

/**
 * Handle incoming changes and create/update/delete tasks
 * @param {object} change - The current change
 */

function changeHandler(change) {
    let task = change.doc.data();
    task.id = change.doc.id;
    // render new tasks on the board
    if (change.type === "added") {
        renderTask(task);
    }
    // clean and re-render updated tasks on the board
    if (change.type === "modified") {
        document.getElementById(task.id).remove();
        renderTask(task);
        showAlert("Task updated");
    }
    // remove tasks from the board
    if (change.type === "removed") {
        document.getElementById(task.id).remove();
    }
}

/**
 * Renders a task on the board and enables Drag & Drop
 * @param {object} task - The task object
 */

function renderTask(task) {
    // Prepare task node for insertion
    let node = htmlStringToNode(getTaskHtmlString(task));
    // Reference the correct column and preprend the task
    let col = document.getElementById(task.position);
    col.prepend(node);
    // Enable Drag and Drop
    enableDragAndDrop(node);
}

/**
 * Changes the status of a task to completed
 * @param {object} id - The ID of the task to complete
 */
function completeTask(id) {
    db.collection('tasks').doc(id).update({ position: 'completed' });
    showAlert('Task completed');
}
/**
 * Deletes a task from the DB
 * @param {object} id - The ID of the task to delete
 */
function deleteTask(id) {
    db.collection('tasks').doc(id).delete().then(function () {
        showAlert('Task deleted');
    }).catch(function (error) {
        console.error("Error removing document: ", error);
        showAlert('Error!');
    });
}


/*                     */
/* Drag & Drop Section */
/*                     */


/**
 * Makes new tasks draggable and adds Event Listeners
 * @param {object} elem - The node to handle
 */

function enableDragAndDrop(elem) {
    elem.setAttribute('draggable', true);
    elem.addEventListener('dragstart', dragStart);
    elem.addEventListener('dragend', dragEnd);
};

/**
 * Set up drop zones
 */

const droppableElements = document.querySelectorAll('.item-column');
droppableElements.forEach(elem => {
    elem.addEventListener('dragover', dragOver);
    elem.addEventListener('dragenter', dragEnter);
    elem.addEventListener('dragleave', dragLeave);
    elem.addEventListener('drop', drop);
});

/**
 * Store data of dragged task and change opacity
 * @param {object} event - The drag event
 */

function dragStart(event) {
    dragged = event.target;
    event.target.style.opacity = .5;
}

function dragEnd(event) {
    event.target.style.opacity = '';
}

/**
 * Shows the placeholder
 * @param {object} event - The drag event
 */

function dragEnter(event) {
    let placeholder = dragged;
    if (event.target.className == 'item-column') {
        event.target.prepend(placeholder);
    }
}

function dragLeave(event) {
}

/**
 * Allows dropping
 * @param {object} event - The drag event
 */

function dragOver(event) {
    event.preventDefault();
}

/**
 * Move task from old the new column and write it to the db
 * @param {object} event - The drag event
 */

function drop(event) {
    event.preventDefault();
    let node = event.target;
    while (node.className != 'item-column') {
        node = node.parentNode;
    }
    dragged.parentNode.removeChild(dragged);
    db.collection('tasks').doc(dragged.id).update({ position: node.id });
    node.prepend(dragged);
    node.style.background = '';
}