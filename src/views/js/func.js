
/**
* Creates client side Cloud Firestore instance
*/
firebase.initializeApp(JSON.parse(cliente));


/**
* Configures Firebase to not persisting the authentication in local storage
*/
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);


/**
* Sends token to backend
*/
function sendToken(email, password){
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(({ user }) => {
    return user.getIdToken().then((idToken) => {
        return fetch("/sessionLogin", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                //"CSRF-Token": Cookies.get("XSRF-TOKEN"),
            },
            body: JSON.stringify({ idToken }),
        });
    });
    })
    .then(() => {
        return firebase.auth().signOut();
    })
    .then(() => {
        window.location.assign("/");
    })
    .catch(function(error) {
        // Handle Errors
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode === 'auth/wrong-password') {
            alert('Contraseña incorrecta');
        } else {
            console.log(error);
        }
        // [END_EXCLUDE]
    });
}


/**
* Handles the sign up button press.
*/
function handleSignUp() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    
    if (email.length < 4) {
        alert('Por favor, ingrese una dirección de E-mail válida');
        return;
    }
    if (password.length < 4) {
        alert('Por favor, ingrese una contraseña mayor a 4 caracteres');
        return;
    }
    // Sign in with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(user => {
            //console.log(user);
            sendToken(email, password);
        })
        .catch(error => {
            // Handle Errors.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode == 'auth/weak-password') {
                alert('La contraseña es muy débil. Como el amor que te tiene ella');
            } else {
                alert(errorMessage);
            }
            console.log(error);
            // [END_EXCLUDE]
        });

    // [END createwithemail]
}


/**
* Handles the sign in button press.
*/
document.getElementById("loginForm")
.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
    } else {
        if (email.length < 4) {
            alert('Por favor, ingrese una dirección de E-mail válida');
        return;
        }
        if (password.length < 4) {
            alert('Por favor, ingrese una contraseña mayor a 4 caracteres');
        return;
        }
        // Sign in with email and pass.
        // [START authwithemail]
        sendToken(email, password);
    }
    return false;
});