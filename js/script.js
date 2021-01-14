window.addEventListener('load',myinit);
// Allow read/write access on all documents to any user signed in to the application

const firebaseConfig = {
  apiKey: "AIzaSyDX_Lsm5VlyC6Nht9Orcv66EWTT1fiigxQ",
  authDomain: "kanban-management.firebaseapp.com",
  projectId: "kanban-management",
  storageBucket: "kanban-management.appspot.com",
  messagingSenderId: "345279118292",
  appId: "1:345279118292:web:0610691d4e6551ea4ff441",
  measurementId: "G-LVWL45W2PG"
};
firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();

firebase.auth().onAuthStateChanged(function(u) {
	if (u) {
	  // User is signed in.
	  //-...const user = firebase.auth().currentUser;
	} else {
	  // User is signed out.
	  // ...
	}
  });
  //	console.log(user.displayName); 
  db.collection("tasks")
  .onSnapshot(function(querySnapshot) {
	  let categories = document.querySelector('#categories');
	  categories.innerHTML = '';
	  querySnapshot.forEach(function(doc) {
		  
		  if(doc.data().category != undefined)
		  categories.innerHTML += `<option value="${doc.data().category}">`;
	  });
	  
  });





// run the function onload
function myinit(){
	document.querySelector('#create').addEventListener('click', createTask);
	document.querySelector('#cancel').addEventListener('click', mytest);
}

function mytest(){
	
	// Initialize Firebase with a default Firebase project
	let test = document.getElementById("test");
	test.innerHTML = '';
	db.collection('tasks').orderBy('title','asc').get().then( function(query) { 
		query.forEach( function(doc) {
			test.innerHTML += '<div style="border: solid 1px"><span style="color:red">'+ doc.data().title + "</span> "
			+ doc.data().duedate + " - "
			+ doc.data().category + " - "
			+ doc.data().urgency + " - "
			+ doc.data().user + " <br> "
			+ doc.data().description + " </div> "; 
		}); 
	});
	return false;
}
function getCaterories(){
	db.collection('categories').orderBy('name','asc').get().then( function(query) { 
		query.forEach( function(doc) {
			console.log(doc.data().name); 
		}); 
	});
	
}
function createTask (){
	let el = document.querySelector('form').elements;
	// Add a new document with a generated id and return the document or false
	db.collection("tasks").add({
	    'title' : el.namedItem('title').value,
	    'duedate' : el.namedItem('duedate').value,
	    'date' : firebase.firestore.Timestamp.now().toDate(),
	    'category' : el.namedItem('category').value,
	    'urgency' : el.namedItem('urgency').value,
	    'user' : firebase.auth().currentUser.displayName,
	    'description' : el.namedItem('description').value,
	    'position' : 'backlog'
	})
	.then(function(docRef) {
	    console.log("Document written with ID: ", docRef.id);
		
		el.namedItem('title').value = "";
		el.namedItem('description').value = "";
		return docRef;
	})
	.catch(function(error) {
	    console.error("Error adding document: ", error);
	    return false;
	});
}
