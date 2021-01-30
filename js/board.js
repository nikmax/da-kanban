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
// create/modify Task
function createTask (){
    let el = document.querySelector('form').elements;
    if(firebase.auth().currentUser != null){
        let name = firebase.auth().currentUser.displayName;
        //
    } else {let name = "nobody";}
    id = el.namedItem('id').value;
    if (id == ''){
        if(el.namedItem('title').value == '' || el.namedItem('description').value == '' || el.namedItem('urgency').value == '' || el.namedItem('category').value == '' || el.namedItem('duedate').value == ''){
            showDanger("Elemente dürfen nicht leer sein!");
            return false;
        }
        db.collection("tasks").add({
            'title' : el.namedItem('title').value,
            'duedate' : el.namedItem('duedate').value,
            'date' : firebase.firestore.Timestamp.now().toDate(),
            'category' : el.namedItem('category').value,
            'urgency' : el.namedItem('urgency').value,
            'user' : name,
            'position' : 'backlog',
            'description' : el.namedItem('description').value
        }).then(function(){
            showAlert("Task created");
        }).catch(function(error) {
            showDanger("Error adding document: " + error);
            return false;
        });
    }else{
        try{
            db.collection("tasks").doc(id).set({
                    'title' : el.namedItem('title').value,
                    'duedate' : el.namedItem('duedate').value,
                    'category' : el.namedItem('category').value,
                    'urgency' : el.namedItem('urgency').value,
                    'user' :  el.namedItem('user').value,
                    'position' :  el.namedItem('position').value,
                    'description' : el.namedItem('description').value
            });
        }catch(error){
            showDanger("Error modify document: " +error);console.log(error);
            return false;
        }
    }
    clearForm(el,true);
}

window.addEventListener('load',addTaskInit);
let snackbarColor;
function addTaskInit(){
    snackbarColor = notification.style.backgroundColor;
    document.querySelector('[href="addtask.html"]')
        .addEventListener('click',function(e){e.preventDefault(); showForm(''); });
    /*
    document.querySelector('[href="board.html"]')
        .addEventListener('click',function(e){
            e.preventDefault(); 
            document.querySelector('.sidebar').classList.remove('is-visible');
            document.querySelector('.mdl-layout__obfuscator').classList.remove('is-visible');
            document.querySelector('#addtask').style.display = "none";
            document.querySelector('#board').style.display = "unset";
            document.querySelector('#backlog').style.display = "none";
    });
    */
    document.querySelector('[href="backlog.html"]')
        .addEventListener('click',function(e){
            e.preventDefault(); 
            document.querySelector('.sidebar').classList.remove('is-visible');
            document.querySelector('.mdl-layout__obfuscator').classList.remove('is-visible');
            document.querySelector('#addtask').style.display = "none";
            document.querySelector('#board').style.display = "none";
            document.querySelector('#backlog').style.display = "unset";
    });

    document.querySelector('#addbutton')
        .addEventListener('click',function(e){ e.preventDefault();showForm(''); });
    document.querySelector(".mdl-custom-close").onclick = function() {//        'use strict';   
        document.querySelector('#addtask').style.display = "none";
    }
    document.querySelector('#create').addEventListener('click', createTask, false);
    /*
        document.querySelectorAll('a[data-id]').forEach(function(el,i){
            el.addEventListener('click',function(e){
                showForm(e,el.getAttribute('data-id'));

            });
        });*/
    /* Use if you whant to close modal when click outside of modal window */
    window.onclick = function(event) {//'use strict';
        if (event.target == document.querySelector('#addtask')) {
            //document.querySelector('#addtask').style.display = "none";
        }
    }
    db.collection("tasks")
      .onSnapshot(function(querySnapshot) {
          let categories = document.querySelector('#categories');
          const catArray = [];
          categories.innerHTML = '';
          querySnapshot.forEach(function(doc) {
            const catItem = doc.data().category;
            if(catItem != undefined && catItem.trim() != '')

                if(catArray[catItem.trim()] == null ){
                    catArray[catItem.trim()] = 1;
                }else{
                    catArray[catItem.trim()]++;
                }
          });
          for(let i in catArray){
            categories.innerHTML += `<option value="${i}">`;
                    //console.log(`<option value="${i} (${catArray[i]})">`);
          }
          
      });

    const auth = firebase.auth();
    firebase.auth().onAuthStateChanged(function(u) {
        if (u) {
          //showAlert('User is signed in.');
          //-...const user = firebase.auth().currentUser;
        } else {
          //showAlert('User is signed out.');
          // ...
        }
      });
}
function showForm(id){
    //e.preventDefault();
    let el = document.querySelector('form').elements;
    clearForm(el,false);
    if(id == ''){
        document.querySelector('#create').innerHTML = 'CREATE NEW TASK';
        document.querySelector('.sidebar').classList.remove('is-visible');
        document.querySelector('.mdl-layout__obfuscator').classList.remove('is-visible');
    }else{
        db.collection("tasks").doc(id)
        .get().then(function(doc) {
            if (doc.exists){
                el.namedItem('position').value = doc.data().position;
                el.namedItem('user').value = doc.data().user;
                el.namedItem('id').value = id;
                el.namedItem('urgency').value = doc.data().urgency;
                el.namedItem('category').value = doc.data().category;
                el.namedItem('duedate').value = doc.data().duedate;
                el.namedItem('description').value = doc.data().description;
                el.namedItem('title').value = doc.data().title;
                //el.namedItem('title').parentNode.classList.add('is-upgraded');
                document.querySelector('#create').innerHTML = 'UPDATE MODIEFIED TASK';
                //document.querySelector('#create').removeEventListener('click', createTask, false); 
            } else {
                showDanger("No such document with id: " + id);
        }}).catch(function(error) {
            showDanger("Error getting document:" + error);
        });
    }
}
function showAlert(msg) {
    let data = {
      message: msg,
      timeout: 2000,
      actionText: ''
    };
    notification.MaterialSnackbar.showSnackbar(data);
}
function showDanger(msg) {
    
    notification.style.backgroundColor = 'red';
    let data = {
      message: msg,
      timeout: 2000,
      actionText: ''
    };
    notification.MaterialSnackbar.showSnackbar(data);
    setTimeout(function(){ notification.style.backgroundColor = snackbarColor; }, 2000);
}
function clearForm(el,hide){
    el.namedItem('id').value = "";
    el.namedItem('title').value = "";
    el.namedItem('urgency').value = "";
    el.namedItem('description').value = "";
    el.namedItem('category').value = "";
    el.namedItem('duedate').value = "";
    el.namedItem('title').focus();
    if(hide) document.querySelector('#addtask').style.display = "none";
    else document.querySelector('#addtask').style.display ='block';
}
