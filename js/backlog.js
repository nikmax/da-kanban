

function renderTaskHtml(task) {
    // Limit field length
    /*
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
    */
    // Return HTML string
    // <div class="mdl-cell mdl-cell--12-col-desktop mdl-cell--12col-tablet mdl-cell--12col-phone board-column"></div>
    let lines = task.description.split('\n');
    if(lines[0].length > 40) lines[0] = lines[0].substr(0,40) + '...';

    let html = `<div class="mdl-shadow--2dp mdl-cell--12-col backlog" id="${task.id}" onmouseover="MouseOver(this)" onmouseout="MouseOut(this)">
            <div style="min-width:10vw;">${task.user} </div>
            <div style="min-width:15vw;">${task.category} </div>
            <div style="min-width:45vw;">${lines[0]} </div>
            <span class="actions">
                <a href="#" onclick="boardTask('${task.id}')")><i class="material-icons" title="ToDo">done</i></a>
                <a href="#" onclick="showForm('${task.id}')"><i class="material-icons" title="Edit">edit</i></a>
                <a href="#" onclick="deleteTask('${task.id}')"><i class="material-icons" title="Delete">delete</i></a>
            </span>
        </div>`;
      return html;
}

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

db.collection('tasks').where('position', '==', 'backlog')
    .onSnapshot(function (snapshot) {
        snapshot.docChanges().forEach(function (change) {
            console.log(change.doc.data());
            if (change.type === "added") {
                let task = change.doc.data();
                task.id = change.doc.id;
                let row = document.getElementById("backlog");

                let node = htmlToElement(renderTaskHtml(task));
                row.append(node);
            }
            if (change.type === "modified") {
                let task = change.doc.data();
                task.id = change.doc.id;
                let node = document.getElementById(task.id);
                let parent = node.parentNode;
                parent.replaceChild(htmlToElement(renderTaskHtml(task)), node);
                showAlert('Task updated');
            }
            if (change.type === "removed") {
                document.getElementById(change.doc.id).remove();
                showAlert('Task removed');
            }
        });
});
function clickAction(task){
    console.log(task);
}
function MouseOver(el){
    //console.log(el);
    document.querySelector('#'+el.id+' > .actions').classList.add('actions-hover');
}
function MouseOut(el){
    document.querySelector('#'+el.id+' > .actions').classList.remove('actions-hover');
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