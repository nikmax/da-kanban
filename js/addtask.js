window.addEventListener('load',addTaskInit);


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
                  <input type="text" placeholder="Title" id="title" name="title">
                </div>
                <div class="mdl-cell mdl-cell--6-col">
                  <label for="duedate">Duedate</label><br>
                  <input type="date" id="duedate" name="duedate" placeholder="duedate">
                </div>
            </div>  
            <div class="mdl-grid">
                <div class="mdl-cell mdl-cell--6-col">
                  <label for="category">Category</label><br>
                  <input type="text" id="category" name="category" list="categories" placeholder="Category">
                  <datalist id="categories"></datalist>
                </div>
                <div class="mdl-cell mdl-cell--6-col">
                  <label for="urgency">Urgency</label><br>
                  <select id="urgency" name="urgency">
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
    el.namedItem('position').value = "";
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

// create/modify Task
function createTask (){
    let el = document.querySelector('form').elements;
    if(firebase.auth().currentUser != null){
        let name = firebase.auth().currentUser.displayName;
        //
    } else {let name = "nobody";}
    id = el.namedItem('id').value;
    if (id == ''){
        if(el.namedItem('position').value == '' || el.namedItem('title').value == '' || el.namedItem('description').value == '' || el.namedItem('urgency').value == '' || el.namedItem('category').value == '' || el.namedItem('duedate').value == ''){
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
            'position' :  el.namedItem('position').value,
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
