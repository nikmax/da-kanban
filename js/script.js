function createTask (title, duedate, category, urgency, user, description){
	// Add a new document with a generated id.
	db.collection("tasks").add({
	    'title' : title,
	    'duedate' : duedate,
	    'date' : '',
	    'category' : category,
	    'urgency' : urgency,
	    'user' : user,
	    'description' : description,
	    'position' : 'backlog'
	})
	.then(function(docRef) {
	    console.log("Document written with ID: ", docRef.id);
	    return docRef;
	})
	.catch(function(error) {
	    console.error("Error adding document: ", error);
	    return false;
	});
}


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
function myinit(){
	document.querySelector('#bt_create').addEventListener('click', mytest);
}

function mytest(event){
	console.log(event);
	// Initialize Firebase with a default Firebase project
	let test = document.getElementById("test");
	
	db.collection('tasks').orderBy('title','asc').get().then( function(query) { 
		query.forEach( function(doc) {
			test.innerHTML += doc.data().title + "<br>"; 
		}); 
	});
	return false;
}