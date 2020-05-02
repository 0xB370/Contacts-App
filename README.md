# Contacts-App

CRUD made using the stack: Firebase, Express.js, Node.js.

Used morgan as middleware and handlebars.js on views.

To run the app:

- Set the google credentials file with the keys as an environment variable named CREDS
_E.g. command for linux:_
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

**IMPORTANT!** In linux the export command doesn't export the variable to another terminal session. So if you export it in a terminal, you use it on the same terminal.

- Run _npm start_.

- Open your browser in _localhost:3000_.
