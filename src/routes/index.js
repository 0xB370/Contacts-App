const { Router } = require('express');
const router = Router();
const admin = require('firebase-admin');
const firebase = require("firebase");


// Request $CREDS environment variable
var keys = process.env['CREDS'];
if (!keys) {
  throw new Error('The $CREDS environment variable was not found!');
}
keys = JSON.parse(keys);

// Creating Cloud Firestore instance
admin.initializeApp({
  credential: admin.credential.cert(keys)
});
const db = admin.firestore();

// Request $CLIENTE environment variable
var cliente = process.env['CLIENTE'];
if (!cliente) {
  throw new Error('The $CLIENTE environment variable was not found!');
}
cliente = JSON.parse(cliente);

firebase.initializeApp(cliente);


// Functions
function iniciarSesion(email, password, res){
    if (firebase.auth().currentUser) {
        firebase.auth().signOut();
    }
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(({ user }) => {
    return user.getIdToken().then((idToken) => {
       const expiresIn = 60 * 60 * 8 * 1000;
       admin
           .auth()
           .createSessionCookie(idToken, { expiresIn })
           .then(
           (sessionCookie) => {
               const options = { maxAge: expiresIn, httpOnly: true };
               res.cookie("session", sessionCookie, options);
               //res.end(JSON.stringify({ status: "Success" }));
               res.redirect('/');
           },
           (error) => {
               res.status(401).send("REQUEST DESAUTORIZADO!");
           }
       );
       return;
    });
    })
    .then(() => {
        return firebase.auth().signOut();
    }).catch(function(error) {
        // Handle Errors
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode === 'auth/wrong-password') {
            res.jsonp({
                fail : true, 
                mensaje : "CONTRASEÑA INCORRECTA CARNERO"
            });
        } else {
            console.log(error);
            res.jsonp({
                fail : true, 
                mensaje : errorMessage
            });
        }
        // [END_EXCLUDE]
    });
}


// Set session cookie
router.post('/sessionLogin', (req, res) => {
    var email = req.body.email.toString();
    var password = req.body.password.toString();
    iniciarSesion(email, password, res);
});


// Clear session cookie
router.get('/sessionLogout', (req, res) => {
    res.clearCookie("session");
    res.redirect("/");
});


// Home page GET
router.get('/', (req, res) => {
    const sessionCookie = req.cookies.session || "";
    admin.auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(() => {
        var arreglo = new Array();
        db.collection('contactos').get().then((snapshot) => {
            snapshot.forEach((doc) => {
                var documento = doc.data();
                documento.id = doc.id;
                arreglo.push(documento);
            });  
            res.render('index', {contacts: arreglo});
        })
        .catch((err) => {
            console.log('Error getting documents', err);
            res.render('index');
        });  
    })
    .catch((error) => {
        res.render("home");
    });
});


// Post new user
router.post('/new-user', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    if (email.length < 4) {
        res.jsonp({
            fail : true, 
            mensaje : "Por favor, ingrese una dirección de E-mail válida"
        });
        return;
    }
    if (password.length < 4) {
        res.jsonp({
            fail : true, 
            mensaje : "Por favor, ingrese una contraseña mayor a 4 caracteres"
        });
        return;
    }
    // Sign in with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(user => {
            iniciarSesion(email, password, res);
        })
        .catch(error => {
            // Handle Errors.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode == 'auth/weak-password') {
                res.jsonp({
                    fail : true, 
                    mensaje : "La contraseña es muy débil. Como el amor que te tiene ella"
                });
            } else {
                res.jsonp({
                    fail : true, 
                    mensaje : errorMessage
                });
            }
            console.log(error);
            // [END_EXCLUDE]
        });

    // [END createwithemail]
});  


// Post new contact
router.post('/new-contact', (req, res) => {
    console.log(req.body);
    const newContact = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        telefono: req.body.telefono
    };
    db.collection('contactos').add(newContact);
    res.redirect('/');
})

// Delete a contact
router.get('/delete-contact/:id', (req, res) =>{
    db.collection('contactos').doc(req.params.id).delete();
    res.redirect('/');
});


module.exports = router;