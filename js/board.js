/**
 * DB configuration is done in firebase.js
 */

/**
 * We are using Google Firebase here. DB connection is configured in firebase.js.
 * We are watching the DB for changes and trigger a handler upon recieving a change.
 * @function db
 * @param {String} collection The collection in use is 'tasks'
 * @param {String|String[]} where The standard query selects all tasks that are either in To Do, In Progress, Testing or Done
 * @param {Object} onSnapshot Call changeHandler upon receiving a change
 */

db.collection('tasks').where('position', 'in', ['todo', 'inprogress', 'testing', 'done'])
    .onSnapshot(function (snapshot) {
        snapshot.docChanges().forEach(function (change) {
            changeHandler(change);
        });
    });

/**
 * Handle incoming changes and create/update/delete tasks
 * @function changeHandler
 * @param {object} change - The current change (sent from Firebase)
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
 * @function renderTask
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
 * @function completeTask
 * @param {number} id - The ID of the task to complete
 */
function completeTask(id) {
    db.collection('tasks').doc(id).update({ position: 'completed' });
    showAlert('Task completed');
}
/**
 * Deletes a task from the DB
 * @function deleteTask
 * @param {number} id - The ID of the task to delete
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
 * @function enableDragAndDrop
 * @param {object} elem - The node to handle
 */

function enableDragAndDrop(elem) {
    elem.setAttribute('draggable', true);
    elem.addEventListener('dragstart', dragStart);
    elem.addEventListener('dragend', dragEnd);
};

/**
 * Grab all item columns and enable them for dropping
 * @constant {object} 
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
 * @function dragStart
 * @param {object} event - The drag event (also contains the drag item)
 */

function dragStart(event) {
    dragged = event.target;
    event.target.style.opacity = .5;
}

/**
 * Revert the opacity on drag end event
 * @function dragEnd
 * @param {object} event - The drag event (also contains the drag item)
 */

function dragEnd(event) {
    event.target.style.opacity = '';
}

/**
 * Shows a placeholder when an item is dragged over a new column
 * @param {object} event - The drag event (also contains the drag item)
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
 * Allows dropping for the current dragged item
 * @function dragOver
 * @param {object} event - The drag event
 */

function dragOver(event) {
    event.preventDefault();
}

/**
 * Move task from old the new column and write it to the db
 * @function drop
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