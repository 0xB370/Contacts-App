const { Router } = require('express');
const router = Router();
require("firebase/auth");
require("firebase/firestore");
const admin = require('firebase-admin');

const {auth} = require('google-auth-library');











// load the environment variable with our keys
const keysEnvVar = process.env['CREDS'];
if (!keysEnvVar) {
  throw new Error('The $CREDS environment variable was not found!');
}
const keys = JSON.parse(keysEnvVar);

async function main() {
  // load the JWT or UserRefreshClient from the keys
  const client = auth.fromJSON(keys);
  client.scopes = ['https://www.googleapis.com/auth/cloud-platform'];
  const url = `https://dns.googleapis.com/dns/v1/projects/${keys.project_id}`;
  const res = await client.request({url});
  //console.log(res.data);
}

main().catch(console.error);















admin.initializeApp({
  credential: admin.credential.cert(keys)
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