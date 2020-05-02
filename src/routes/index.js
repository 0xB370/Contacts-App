const { Router } = require('express');
const router = Router();
require("firebase/auth");
require("firebase/firestore");
const admin = require('firebase-admin');
const {auth} = require('google-auth-library');

// Set the google credentials file with the keys as an environment variable named CREDS
// E.g. command for linux: 
/*
export CREDS='{
"type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-private-key-id",
  "private_key": "your-private-key",
  "client_email": "your-client-email",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://accounts.google.com/o/oauth2/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "your-cert-url"
}'
*/
// IMPORTANT! In linux the export command doesn't export the variable to another terminal 
// session. So if you export it in a terminal, you use it on the same terminal. 
const keysEnvVar = process.env['CREDS'];
if (!keysEnvVar) {
  throw new Error('The $CREDS environment variable was not found!');
}
const keys = JSON.parse(keysEnvVar);

async function main() {
  const client = auth.fromJSON(keys);
  client.scopes = ['https://www.googleapis.com/auth/cloud-platform'];
  const url = `https://dns.googleapis.com/dns/v1/projects/${keys.project_id}`;
  const res = await client.request({url});
}

main().catch(console.error);

admin.initializeApp({
  credential: admin.credential.cert(keys)
});

const db = admin.firestore();

// Get all contacts
router.get('/', (req, res) => {
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
    
});

// Post new contacts
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