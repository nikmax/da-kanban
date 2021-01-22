window.addEventListener('load',addTaskInit);

function addTaskInit(){
	const auth = firebase.auth();
	document.querySelector('[href="addtask.html"]')
		.addEventListener('click',function(e){
			showForm(e,'');
	});
	document.querySelector(".mdl-custom-close").onclick = function() {
		'use strict';	
		document.querySelector('#addtask').style.display = "none";
	}
	document.querySelector('#create').addEventListener('click', createTask, false);
	document.querySelectorAll('main a.mdl-button').forEach(function(el,i){
		el.addEventListener('click',function(e){
			showForm(e,el.parentNode.parentNode.id);
		});
	});
	/* Use if you whant to close modal when click outside of modal window */
	window.onclick = function(event) {
		'use strict';
		
	    if (event.target == document.querySelector('#addtask')) {
	        document.querySelector('#addtask').style.display = "none";
	    }
	}

	db.collection("tasks")
	  .onSnapshot(function(querySnapshot) {
		  let categories = document.querySelector('#categories');
		  categories.innerHTML = '';
		  querySnapshot.forEach(function(doc) {
			  
			if(doc.data().category != undefined)
				categories.innerHTML += `<option value="${doc.data().category}">`;
				//console.log(`<option value="${doc.data().category}">`);
		  });
		  
	  });
	firebase.auth().onAuthStateChanged(function(u) {
		if (u) {
		  // User is signed in.
		  //-...const user = firebase.auth().currentUser;
		} else {
		  // User is signed out.
		  // ...
		}
	  });


}

function showForm(e,id){
	e.preventDefault();
	document.querySelector('form').elements.namedItem('id').value = id;
	if(id == ''){
		document.querySelector('#title').value = '';
		document.querySelector('#create').innerHTML = 'CREATE NEW TASK';
		document.querySelector('.sidebar').classList.remove('is-visible');
		document.querySelector('.mdl-layout__obfuscator').classList.remove('is-visible');

		document.querySelector('#addtask').style.display ='block';
		document.querySelector('#title').focus();
	}else{
		db.collection("tasks").doc(id)
		.get().then(function(doc) {
			if (doc.exists){
				let el = document.querySelector('form').elements;
				el.namedItem('id').value = id;
				el.namedItem('urgency').value = doc.data().urgency;
				el.namedItem('category').value = doc.data().category;
				el.namedItem('duedate').value = doc.data().duedate;
				el.namedItem('description').value = doc.data().description;
      			el.namedItem('title').value = doc.data().title;
      			document.querySelector('#create').innerHTML = 'UPDATE MODIEFIED TASK';
      			document.querySelector('#addtask').style.display ='block';
				el.namedItem('title').focus();
    		} else {
      			showAlert("No such document with id: " + id);
    	}}).catch(function(error) {
      		showAlert("Error getting document:" + error);
   		});
	}
}

function createTask (){
	let el = document.querySelector('form').elements;
	if(firebase.auth().currentUser != null){
		let name = firebase.auth().currentUser.displayName;
	}
	else {
		let name = "nobody";
	}

	if (el.namedItem('id').value == ''){
		// Add a new document with a generated id and return the document or false
		db.collection("tasks").add({
		    'title' : el.namedItem('title').value,
		    'duedate' : el.namedItem('duedate').value,
		    'date' : firebase.firestore.Timestamp.now().toDate(),
		    'category' : el.namedItem('category').value,
		    'urgency' : el.namedItem('urgency').value,
		    'user' : name,
		    'description' : el.namedItem('description').value,
		    'position' : 'backlog'
		})
		.then(function(docRef) {
		    showAlert("Document written with ID: "+ docRef.id);
			
			el.namedItem('title').value = "";
			el.namedItem('description').value = "";
			el.namedItem('category').value = "";
			el.namedItem('title').focus();
			document.querySelector('#addtask').style.display = "none";
			return docRef;
		})
		.catch(function(error) {
		    showAlert("Error adding document: " + error);
		    return false;
		});
	}else{
		db.collection("tasks").doc(el.namedItem('id').value).set({
		    'title' : el.namedItem('title').value,
		    'duedate' : el.namedItem('duedate').value,
		    'category' : el.namedItem('category').value,
		    'urgency' : el.namedItem('urgency').value,
		    'description' : el.namedItem('description').value
		})
		.then(function(docRef) {
		    showAlert("Document updated with ID: " + el.namedItem('id').value);
			
			el.namedItem('title').value = "";
			el.namedItem('description').value = "";
			el.namedItem('category').value = "";
			el.namedItem('title').focus();
			document.querySelector('#addtask').style.display = "none";
			return true;
		})
		.catch(function(error) {
		    showAlert("Error adding document: " + error);
		    return false;
		});

	}
}

function showAlert(msg) {
	'use strict';

	let snackbarContainer = document.querySelector('#demo-snackbar-example');
	let showSnackbarButton = document.querySelector('#demo-show-snackbar');

	let data = {
	  message: msg,
	  timeout: 2000,
	  actionHandler: '',
	  actionText: ''
	};
	snackbarContainer.MaterialSnackbar.showSnackbar(data);
}
