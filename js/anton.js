// html
//<script src="https://www.gstatic.com/firebasejs/ui/4.6.1/firebase-ui-auth.js"></script>
//<link type="text/css" rel="stylesheet" href="https://www.gstatic.com/firebasejs/ui/4.6.1/firebase-ui-auth.css" />

//         <div id="firebaseui-auth-container"></div>
//         <div id="loader">Loading...</div>



// Initialize the FirebaseUI Widget using Firebase.
let ui = new firebaseui.auth.AuthUI(firebase.auth());
let uiConfig = {
	callbacks: {
	  signInSuccessWithAuthResult: function(authResult, redirectUrl) {
		// User successfully signed in.
		// Return type determines whether we continue the redirect automatically
		// or whether we leave that to developer to handle.
		var user = firebase.auth().currentUser;
		console.log('initialized', user) ;
		return true;
	  },
	  uiShown: function() {
		// The widget is rendered.
		// Hide the loader.
		document.getElementById('loader').style.display = 'none';
	  }
	},
	// Will use popup for IDP Providers sign-in flow instead of the default, redirect.
	signInFlow: 'popup',
	signInSuccessUrl: '#',
	signInOptions: [
	  // Leave the lines as is for the providers you want to offer your users.
	  firebase.auth.GoogleAuthProvider.PROVIDER_ID,
	  firebase.auth.EmailAuthProvider.PROVIDER_ID
	],
	// Terms of service url.
	tosUrl: '<your-tos-url>',
	// Privacy policy url.
	privacyPolicyUrl: '<your-privacy-policy-url>'
};

// run the function onload
	ui.start('#firebaseui-auth-container', uiConfig);