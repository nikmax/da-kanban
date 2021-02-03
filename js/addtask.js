window.addEventListener('load',addTaskInit);

function addTaskInit(){
    snackbarColor = notification.style.backgroundColor;
    /*   document.querySelector('[href="addtask.html"]')
        .addEventListener('click',function(e){e.preventDefault(); showForm(''); });

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
