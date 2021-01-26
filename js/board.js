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


// Success message

var notification = document.querySelector('.mdl-js-snackbar');

/* More drag events

elem.addEventListener('dragstart', function);
elem.addEventListener('dragenter', function);
elem.addEventListener('dragover', function);
elem.addEventListener('dragleave', function);
elem.addEventListener('dragend', function);
elem.addEventListener('drop', function);

*/



/* DB read/write section */


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyDX_Lsm5VlyC6Nht9Orcv66EWTT1fiigxQ",
    authDomain: "kanban-management.firebaseapp.com",
    projectId: "kanban-management",
    storageBucket: "kanban-management.appspot.com",
    messagingSenderId: "345279118292",
    appId: "1:345279118292:web:0610691d4e6551ea4ff441",
    measurementId: "G-LVWL45W2PG"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var db = firebase.firestore();

function renderTask(task) {
    let col = document.getElementById(task.position);
    let node = htmlToElement(renderTaskHtml(task));
    col.append(node);
    dragAndDrop(node);
}

function renderTaskHtml(task) {
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
        <div class="mdl-card__supporting-text">${task.description}</div>
        <div class="mdl-card__actions mdl-card--border task-item-action-row">
          <span class="icon-text"><i class="material-icons" title="Due date">alarm</i><span>${task.duedate}</span></span>
          <span>
            <a href="#"><i class="material-icons" title="Done">done</i></a>
            <a href="#" class="edit-link" data-id="${task.id}"><i class="material-icons" title="Edit">edit</i></a>
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

db.collection('tasks').where('position', '!=', 'backlog')
    .onSnapshot(function (snapshot) {
        snapshot.docChanges().forEach(function (change) {
            if (change.type === "added") {
                console.log("New task: ", change.doc.data());
                let task = change.doc.data();
                task.id = change.doc.id;
                renderTask(task);
            }
            if (change.type === "modified") {
                console.log("Modified task: ", change.doc.data());
                document.getElementById(change.doc.id).remove();
                let task = change.doc.data();
                task.id = change.doc.id;
                renderTask(task);
            }
            if (change.type === "removed") {
                console.log("Removed task: ", change.doc.data());
                document.getElementById(change.doc.id).remove();
            }
        });
    });