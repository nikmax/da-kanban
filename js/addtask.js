window.addEventListener('load',addTaskInit);

let attrs = ['user','title','duedate','category','urgency','description','position'];

let addTaskDiv = `
    <div class="modal-content mdl-card mdl-shadow--2dp">
      <div class="form mdl-card__title mdl-card--expand">
      <form action="#"  st class="mdl-layout__content">
            <div class="mdl-grid">
                <div mdl-cell mdl-cell--12-col">
                  <input type="hidden" name="id" value="">
                  <input type="hidden" name="user" value="">
                  <input type="hidden" name="date" value="">
                </div>
            </div>
            <div class="mdl-grid">
                <div class="mdl-cell mdl-cell--6-col">
                  <label for="title">Title</label><br>
                  <input type="text" placeholder="Title" id="title" name="title" required >
                </div>
                <div class="mdl-cell mdl-cell--6-col">
                  <label for="duedate">Duedate</label><br>
                  <input type="date" id="duedate" name="duedate" placeholder="duedate" required >
                </div>
            </div>  
            <div class="mdl-grid">
                <div class="mdl-cell mdl-cell--6-col">
                  <label for="category">Category</label><br>
                  <input type="text" id="category" name="category" list="categories" placeholder="Category" required >
                  <datalist id="categories"></datalist>
                </div>
                <div class="mdl-cell mdl-cell--6-col">
                  <label for="urgency">Urgency</label><br>
                  <select id="urgency" name="urgency" required >
                      <option value="Low">Low</option>
                      <option value="Middle">Middle</option>
                      <option value="High" selected>High</option>
                  </select>
                </div>
            </div>  

            <div class="mdl-grid">
              <div class="mdl-cell mdl-cell--6-col">
                  <label for="description">Description</label><br>
                  <textarea type="text" rows="3" id="description" name="description" requrired ></textarea>
              </div>
              <div class="mdl-cell mdl-cell--6-col">
                  <label for="position">Position</label>
                  <select id="position" name="position">
                  <option value="backlog" selected="selected">Backlog</option>
                  <option value="todo">ToDo</option>
                  <option value="inprogress">InProgress</option>
                  <option value="testing">Testing</option>
                  </select>
              </div>
            </div>
        </form>

      </div>
      <div class="mdl-card__actions mdl-card--border">
        <a id="create" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" onclick="createTask()">
          Create New Task
        </a>
        <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect mdl-custom-close">
          Close
        </a>
      </div>
      
    </div>
`;

/**
 * @function addTaskInit
 */

function addTaskInit(){
    let node = document.createElement('div');
    node.innerHTML = addTaskDiv.trim();
    node.classList.add('modal');
    node.id = "addtask";
    document.querySelector('body').appendChild(node);

    snackbarColor = notification.style.backgroundColor;

    document.querySelector(".mdl-custom-close").onclick = function() {//        'use strict';   
        document.querySelector('#addtask').style.display = "none";
    }
    db.collection("tasks").onSnapshot(function(querySnapshot) {
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
        }
    });

    
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
/**
 * show the task form for input or modify values
 * @function showForm
 * @param {number} id The id of the task or '' to fill empty values
 */
function showForm(id){
  clearForm(false);
  document.querySelector('#create').innerHTML = 'CREATE NEW TASK';
  if(id != ''){
      document.querySelector('#create').innerHTML = 'UPDATE MODIEFIED TASK';
      db.collection("tasks").doc(id).get().then(function(doc) {
          if (doc.exists) {
            let task = doc.data();
            task.id = id;
            fillForm(task);
          }else showDanger("No such document with id: " + id);
      }).catch(function(error) {
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
    showAlert(msg);
    setTimeout(function(){ notification.style.backgroundColor = snackbarColor; }, 2000);
}
/**
 * create or modify the task in DB
 * @function createTask
 */
function createTask (){
    let task = getTaskValues();
    if (task.id === undefined){ // new task...
        db.collection("tasks").add(task).then(function(){
            showAlert("Task created");
        }).catch(function(error) {
            showDanger("Error adding document: " + error);
            return false;
        });
    }else{ // modify task
        let id = task.id;
        delete task.id;
        db.collection("tasks").doc(id).set(task).then(function(){
        	showAlert("Task modified");
        }).catch(function(error){
            showDanger("Error modify document: " +error);
            return false;
        });
    }
    clearForm(true);
}
function getUserName(){
	if(firebase.auth().currentUser != null){
        return firebase.auth().currentUser.displayName;
    } else return "nobody";
}
/**
 * get values from a form and return the new task object
 * if a id input field is not set, fill the current date to a task attribute
 * @function getTaskValues
 */
function getTaskValues(){
    let obj = {};
    //let name = getUserName();
    let el = document.querySelector('form').elements;
	for (let i = 0; i < attrs.length; i++){
   		const attr = attrs[i];
   		obj[attr] = el[attr].value;
    }
    if (el['id'].value != ''){
      obj.id = el['id'].value;
    }else obj['date'] = firebase.firestore.Timestamp.now().toDate();
    return obj;       	
}
/**
 * fill form inputs with values of the task
 * @function fillForm
 * @param {object} item The task object
 */
function fillForm(item){
  let el = document.querySelector('form').elements;
	for (let i = 0; i < attrs.length; i++){
   		const attr = attrs[i];
   		el[attr].value = item[attr];
    }
    el['id'].value = item.id;
}
/**
 * fill form inputs with empty values
 * @function clearForm
 * @param {boolean} hide if true - the form div will be hidden
 */
function clearForm(hide){
  let el = document.querySelector('form').elements;
  for (let i = 0; i < attrs.length; i++){
    let attr = attrs[i];
    el[attr].value  = "";
  }
  
  if(hide) document.querySelector('#addtask').style.display = "none";
  else document.querySelector('#addtask').style.display ='block';
  el['title'].focus();
}
