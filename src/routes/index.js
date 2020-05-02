const { Router } = require('express');
const router = Router();
require("firebase/auth");
require("firebase/firestore");


const admin = require('firebase-admin');
admin.initializeApp({
  //credential: admin.credential.applicationDefault()
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
});

const db = admin.firestore();



router.get('/', (req, res) => {
    var arreglo = new Array();
    db.collection('contactos').get().then((snapshot) => {
        snapshot.forEach((doc) => {
            var documento = doc.data();
            documento.id = doc.id;
            //console.log(coso);
            arreglo.push(documento);
        });  
        res.render('index', {contacts: arreglo});
    })
    .catch((err) => {
        console.log('Error getting documents', err);
        res.render('index');
    });
    
});




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


router.get('/delete-contact/:id', (req, res) =>{
    db.collection('contactos').doc(req.params.id).delete();
    res.redirect('/');
    
});




module.exports = router;