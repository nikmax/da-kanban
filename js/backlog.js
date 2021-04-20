window.onload = function(e){
    widthscreen = window.innerWidth;
}
window.onresize = function(e){
    if ((window.innerWidth < 600 && widthscreen >= 600) || (window.innerWidth >= 600 && widthscreen < 600)){
        widthscreen = window.innerWidth;
        location.reload();
    }
};
widthscreen = 0;
function renderTaskHtml(task) {
    let html = "";
    if (task.user == '') task.user = 'Noname';
    if (window.innerWidth  < 600){
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
        html = `
        <li style="margin-bottom:30px;" id="${task.id}">
            <div class="mdl-card mdl-shadow--2dp mdl-cell--12-col task-item">
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
        </li>
    `;
    }else{
        html =`
            <li class="mdl-list__item mdl-list__item--three-line backlog" id="${task.id}">
                <span class="mdl-list__item-primary-content itemsli">
                    <i class="material-icons mdl-list__item-avatar">person</i>
                    <span>${task.title}</span>
                    <span class="mdl-list__item-text-body itemdesc"><i>${task.user} - </i>${task.description}</span>
                </span>
                <span class="mdl-list__item-secondary-content itemscat">
                    <span class="mdc-list-item__meta nowrap">${task.category}</span>
                    <a class="actions" href="#">
                
                        <i class="material-icons"  title="Edit" onclick="showForm('${task.id}')">edit
                        </i><i class="material-icons" onclick="boardTask('${task.id}')"
                        title="Publish to Board">publish</i><i class="material-icons"
                        onclick="deleteTask('${task.id}')" title="Delete">delete</i>
                
                </a>
                </span>
                
            </li>
        `;
    }
    return html;
}

function htmlToElement(html) {
    let template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}
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

db.collection('tasks').where('position', '==', 'backlog')
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
    // render new tasks in the backlog list
    if (change.type === "added") {
        renderTask(task);
    }
    if (change.type === "modified") {
        //let node = document.getElementById(task.id);
        //let parent = node.parentNode;
        //parent.replaceChild(htmlToElement(renderTaskHtml(task)), node);
        document.getElementById(task.id).remove();
        renderTask(task);
       // showAlert('Task updated');
    }
    if (change.type === "removed") {
        document.getElementById(change.doc.id).remove();
        //showAlert('Task removed');
    }
}
/**
 * Renders a task in the backlog list
 * @function renderTask
 * @param {object} task - The task object
 */
function renderTask(task) {
    // Prepare task node for insertion
    let node = htmlToElement(renderTaskHtml(task));
    // Append the task
    let col = document.getElementById("backlog");
    col.append(node);
}
function boardTask(id) {
    db.collection('tasks').doc(id).update({ position: 'todo' });
    showAlert('Task akctivated');
}
// Delete Task
function deleteTask(id) {
    db.collection('tasks').doc(id).delete().then(function () {
        showAlert('Task deleted');
    }).catch(function (error) {
        showDanger('Error!');
    });
}