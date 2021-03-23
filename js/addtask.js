window.addEventListener('load',addTaskInit);

let attrs = ['position','user','id','urgency','category','duedate','description','title'];

let addTaskDiv = `
    <div class="modal-content mdl-card mdl-shadow--2dp">
      <div class="form mdl-card__title mdl-card--expand">
      <form action="#"  st class="mdl-layout__content">
            <div class="mdl-grid">
                <div mdl-cell mdl-cell--12-col">
                  <input type="hidden" name="id" value="create">
                  <input type="hidden" name="user" value="">
                </div>
            </div>
            <div class="mdl-grid">
                <div class="mdl-cell mdl-cell--6-col">
                  <label for="title">Title</label><br>
                  <input type="text" placeholder="Title" id="title" name="title" required>
                </div>
                <div class="mdl-cell mdl-cell--6-col">
                  <label for="duedate">Duedate</label><br>
                  <input type="date" id="duedate" name="duedate" placeholder="duedate"required >
                </div>
            </div>  
            <div class="mdl-grid">
                <div class="mdl-cell mdl-cell--6-col">
                  <label for="category">Category</label><br>
                  <input type="text" id="category" name="category" list="categories" placeholder="Category" required>
                  <datalist id="categories"></datalist>
                </div>
                <div class="mdl-cell mdl-cell--6-col">
                  <label for="urgency">Urgency</label><br>
                  <select id="urgency" name="urgency" required>
                      <option value="Low">Low</option>
                      <option value="Middle">Middle</option>
                      <option value="High" selected>High</option>
                  </select>
                </div>
            </div>  

            <div class="mdl-grid">
              <div class="mdl-cell mdl-cell--6-col">
                  <label for="description">Description</label><br>
                  <textarea type="text" rows="3" id="description" name="description"></textarea>
              </div>
              <div class="mdl-cell mdl-cell--6-col">
                  <label for="position">Position</label>
                  <select id="position" name="position">
                  <option value="backlog">Backlog</option>
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
function showForm(id){
    //e.preventDefault();
    let el = document.querySelector('form').elements;
    clearForm(el,false);
    if(id == ''){
        document.querySelector('#create').innerHTML = 'CREATE NEW TASK';
        //document.querySelector('.sidebar').classList.remove('is-visible');
        //document.querySelector('.mdl-layout__obfuscator').classList.remove('is-visible');
    }else{
        db.collection("tasks").doc(id)
        .get().then(function(doc) {
            if (doc.exists){
              let item = doc.data();
              for (let i = 0; i < attrs.length; i++){
                let attr = attrs[i];
                el[attr].value  = item[attr];
              }
              el['id'].value = id;
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
    for (let i = 0; i < attrs.length; i++){
      let attr = attrs[i];
      el[attr].value  = "";
    }
    el['title'].focus();
    if(hide) document.querySelector('#addtask').style.display = "none";
    else document.querySelector('#addtask').style.display ='block';
}

// create/modify Task
function createTask (){
    let el = document.querySelector('form').elements;
    if(firebase.auth().currentUser != null){
        let name = firebase.auth().currentUser.displayName;
        //
    } else {let name = "nobody";}
    id = el['id'].value;
    if (id == ''){
      try{
        db.collection("tasks").add({
            'title' : el['title'].value,
            'duedate' : el['duedate'].value,
            'category' : el['category'].value,
            'urgency' : el['urgency'].value,
            'position' :  el['position'].value,
            'description' : el['description'].value,

            'date' : firebase.firestore.Timestamp.now().toDate(),
            'user' : name

        }).then(function(){
            showAlert("Task created");
        }).catch(function(error) {
            showDanger("Error adding document: " + error);
            return false;
        });
      }catch(error){
            showDanger("Error modify document: " +error);console.log(error);
            return false;
      }
    }else{
        try{
            db.collection("tasks").doc(id).set({
                    'title' : el['title'].value,
                    'duedate' : el['duedate'].value,
                    'category' : el['category'].value,
                    'urgency' : el['urgency'].value,
                    'user' :  el['user'].value,
                    'position' :  el['position'].value,
                    'description' : el['description'].value
            });
        }catch(error){
            showDanger("Error modify document: " +error);console.log(error);
            return false;
        }
    }
    clearForm(el,true);
}
