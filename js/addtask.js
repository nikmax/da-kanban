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
		el.addEventListener('click',createTask,false);
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
	if(id == ''){
		document.querySelector('.sidebar').classList.remove('is-visible');
		document.querySelector('.mdl-layout__obfuscator').classList.remove('is-visible');
		document.querySelector('#addtask').style.display ='block';
		document.querySelector('#title').focus();
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

	if (this.id == 'create'){
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
		    console.log("Document written with ID: ", docRef.id);
			
			el.namedItem('title').value = "";
			el.namedItem('description').value = "";
			el.namedItem('category').value = "";
			el.namedItem('title').focus();
			document.querySelector('#addtask').style.display = "none";
			return docRef;
		})
		.catch(function(error) {
		    console.error("Error adding document: ", error);
		    return false;
		});
	}else{
		console.log(this.id);
		return;
	}
}

