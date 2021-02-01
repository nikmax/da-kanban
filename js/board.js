/* Drag & Drop Section */

function dragAndDrop(elem) {
    elem.setAttribute('draggable', true);
    elem.addEventListener('dragstart', dragStart);
    elem.addEventListener('dragend', dragEnd);
};

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
    //
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
    db.collection('tasks').doc(dragged.id).update({ position: node.id });
    node.prepend(dragged);
    node.style.background = '';
    notification.MaterialSnackbar.showSnackbar(
        {
            message: 'Task moved'
        }
    );
}



/* More drag events

elem.addEventListener('dragstart', function);
elem.addEventListener('dragenter', function);
elem.addEventListener('dragover', function);
elem.addEventListener('dragleave', function);
elem.addEventListener('dragend', function);
elem.addEventListener('drop', function);

*/



/* DB read/write section */



function renderTask(task) {
    let col = document.getElementById(task.position);
    let node = htmlToElement(renderTaskHtml(task));
    col.append(node);
    dragAndDrop(node);
}

function renderTaskHtml(task) {
    // Limit field length
    if (task.description.length > 200) {
        task.description = task.description.substring(0, 199) + '...'
    }
    if (task.title.length > 40) {
        task.title = task.title.substring(0, 39) + '...'
    }
    if (task.category.length > 40) {
        task.category = task.category.substring(0, 39) + '...'
    }
    if (task.user.length > 40) {
        task.user = task.user.substring(0, 39) + '...'
    }
    // Return HTML string
    return `
        <div class="mdl-card mdl-shadow--2dp mdl-cell--12-col task-item" id="${task.id}">
        <div class="mdl-card__title mdl-card--expand">
          <h2 class="mdl-card__title-text">${task.title}</h2>
        </div>
        <div class="mdl-card__title">
          <div class="mdl-card__subtitle-text icon-text"><i class="material-icons" title="Assignee">person</i>${task.user}</div>
        </div>
        <div class="mdl-card__title">
          <div class="mdl-card__subtitle-text icon-text"><i class="material-icons" title="Category">folder</i>${task.category}</div>
        </div>
        <div class="mdl-card__title">
        <div class="mdl-card__subtitle-text icon-text"><i class="material-icons" title="Due date">today</i>${task.duedate}</div>
        </div>
        <div class="mdl-card__supporting-text">${task.description}</div>
        <div class="mdl-card__actions mdl-card--border task-item-action-row">
        <span class="icon-text"><i class="material-icons" title="Urgency">class</i>${task.urgency}</span>
        <span>
            <a href="#" onclick="completeTask('${task.id}')")><i class="material-icons" title="Complete">done</i></a>
            <a href="#" onclick="showForm('${task.id}')"><i class="material-icons" title="Edit">edit</i></a>
            <a href="#" onclick="deleteTask('${task.id}')"><i class="material-icons" title="Delete">delete</i></a>
          </span>
        </div>
      </div>
      `
}

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

db.collection('tasks').where('position', 'in', ['todo', 'inprogress', 'testing', 'done'])
    .onSnapshot(function (snapshot) {
        snapshot.docChanges().forEach(function (change) {
            // render new tasks on the board
            if (change.type === "added") {
                console.log("New task: ", change.doc.data());
                let task = change.doc.data();
                task.id = change.doc.id;
                renderTask(task);
            }
            // clean and re-render updated tasks on the board
            if (change.type === "modified") {
                console.log("Modified task: ", change.doc.data());
                document.getElementById(change.doc.id).remove();
                let task = change.doc.data();
                task.id = change.doc.id;
                renderTask(task);
                showAlert("Task updated");
            }
            //remove tasks from the board
            if (change.type === "removed") {
                console.log("Removed task: ", change.doc.data());
                document.getElementById(change.doc.id).remove();
            }
        });
    });

// Complete Task
function completeTask(id) {
    db.collection('tasks').doc(id).update({ position: 'completed' });
    notification.MaterialSnackbar.showSnackbar(
        {
            message: 'Task completed'
        }
    );
}
// Delete Task
function deleteTask(id) {
    db.collection('tasks').doc(id).delete().then(function () {
        notification.MaterialSnackbar.showSnackbar(
            {
                message: 'Task deleted'
            }
        );
    }).catch(function (error) {
        console.error("Error removing document: ", error);
        notification.MaterialSnackbar.showSnackbar(
            {
                message: 'Error!'
            }
        );
    });
}