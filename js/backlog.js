//window.onresize = function(e){location.reload();};

function renderTaskHtml(task) {
    if (task.user == '') task.user = 'Noname';

    let html =`
        <li class="mdl-list__item mdl-list__item--three-line backlog" id="${task.id}">
            <span class="mdl-list__item-primary-content">
                <i class="material-icons mdl-list__item-avatar">person</i>
                <span>${task.title}</span>
                <span class="mdl-list__item-text-body itemdesc"><i>${task.user} - </i>${task.description}</span>
            </span>
            <span class="mdl-list__item-secondary-content">
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
    return html;
}

function htmlToElement(html) {
    let template = document.createElement('template');
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
    console.log(el.id,document.querySelector(`#${el.id}`));
    //document.getElementById(el.id).classList.add('actions-hover');
    //document.querySelector('#'+el.id + ' a').classList.replace('actions','actionsa');
}
function MouseOut(el){
    //document.getElementById(el.id).classList.remove('actions-hover');
    //document.querySelector('#'+el.id + ' a').classList.replace('actionsa','actions');
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