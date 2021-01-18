//signup
const switchers = [...document.querySelectorAll('.switcher')]

switchers.forEach(item => {
	item.addEventListener('click', function() {
		switchers.forEach(item => item.parentElement.classList.remove('is-active'))
		this.parentElement.classList.add('is-active')
	})
})

 firebase.auth().onAuthStateChanged(function (user){
        if(user){
           console.log("Eingelogt");
           document.getElementById("loginWrapper").style.display = "none";
           document.getElementById("addTask").style.display = "block";
        }else{
            console.log("Ausgelogt")
            document.getElementById("addTask").style.display = "none";
            document.getElementById("loginWrapper").style.display = "block";
        }
    });
    
function register(event){
    event.preventDefault();
    const signupForm = document.getElementById("formSignUp");
    const email = signupForm["signUpEmail"].value;
    const password = signupForm["signUpPassword"].value;
    console.log(email);
    console.log(password);
    auth.createUserWithEmailAndPassword(email, password);
}

function login(event){
    const loginForm = document.getElementById("loginForm");
    event.preventDefault();
    const email = loginForm["login-email"].value;
    const password = loginForm["login-password"].value; 
    auth.signInWithEmailAndPassword(email, password).then(cred => {
    loginForm.reset();
    })
}

function logout(event){
    event.preventDefault();
    firebase.auth().signOut(); 
}


 