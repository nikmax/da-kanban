
let notification = document.querySelector('.mdl-js-snackbar');
let snackbarColor;

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyDX_Lsm5VlyC6Nht9Orcv66EWTT1fiigxQ",
    authDomain: "kanban-management.firebaseapp.com",
    projectId: "kanban-management",
    storageBucket: "kanban-management.appspot.com",
    messagingSenderId: "345279118292",
    appId: "1:345279118292:web:0610691d4e6551ea4ff441",
    measurementId: "G-LVWL45W2PG"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
let db = firebase.firestore();
const auth = firebase.auth();
