const { Router } = require('express');
const router = Router();
const admin = require('firebase-admin');


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
cliente = JSON.stringify(cliente);


// Set session cookie
router.post('/sessionLogin', (req, res) => {
    const idToken = req.body.idToken.toString();
    // In milliseconds (in this case seted to 8 hours)
    const expiresIn = 60 * 60 * 8 * 1000;
    admin
        .auth()
        .createSessionCookie(idToken, { expiresIn })
        .then(
        (sessionCookie) => {
            const options = { maxAge: expiresIn, httpOnly: true };
            res.cookie("session", sessionCookie, options);
            res.end(JSON.stringify({ status: "Success" }));
        },
        (error) => {
            res.status(401).send("UNAUTHORIZED REQUEST!");
        }
    );
});

// Clear session cookie
router.get('/sessionLogout', (req, res) => {
    res.clearCookie("session");
    res.redirect("/");
})


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
        res.render("home", {cliente: cliente});
    });
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