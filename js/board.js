/* Drag & Drop Section */

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

class Task {
    constructor(title, duedate, date, category, urgency, user, description, position) {
        this.title = title;
        this.duedate = duedate;
        this.date = date;
        this.category = category;
        this.urgency = urgency;
        this.user = user;
        this.description = description;
        this.position = position;
    }
    toString() {
        return this.title + ', ' + this.duedate + ', ' + this.date + ', ' + this.category + ', ' + this.urgency + ', ' + this.user + ', ' + this.description + ', ' + this.position;
    }
}

// Firestore data converter
var taskConverter = {
    toFirestore: function (task) {
        return {
            title: task.title,
            duedate: task.duedate,
            date: task.date,
            category: task.category,
            urgency: task.urgency,
            user: task.user,
            description: task.description,
            position: task.position
        };
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data(options);
        return new Task(data.title, data.duedate, data.date, data.category, data.urgency, data.user, data.description, data.position);
    }
};

db.collection('tasks').where('position', '!=', 'backlog')
    .withConverter(taskConverter)
    .onSnapshot(function (querySnapshot) {
        var tasks = [];
        querySnapshot.forEach(function (doc) {
            tasks.push(doc.data());
        });
        console.log(tasks);
    });
