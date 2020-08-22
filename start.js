/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Abstracting server

// Config
const fs = require('fs');
const util = require('util');
const configLoader = require('./config_loader.js');
const unsafeConfig = configLoader.getConfig();

console.log("---");
console.log("Using config:");
console.log(util.inspect(unsafeConfig, {
	'colors': true
}));
console.log("---");

// Set settings
const insecureServer = unsafeConfig['insecureWebserver'];
const secureServer = unsafeConfig['secureWebserver'];
const httpPort = parseInt(unsafeConfig['httpPort']);
const httpsPort = parseInt(unsafeConfig['httpsPort']);
const privateCertificateLocation = unsafeConfig['private_key'];
const publicCertificateLocation = unsafeConfig['public_certs'];


// Https BS
const http = require('http');
const https = require('https');
const privateKey  = fs.readFileSync(privateCertificateLocation, 'utf8');
const certificate = fs.readFileSync(publicCertificateLocation, 'utf8');
const credentials = {
	key: privateKey, 
	cert: certificate
};

// Load server
const app = require('./main_server.js')

const httpServer = insecureServer ? http.createServer(app) : null;
const httpsServer = secureServer ? https.createServer(credentials, app) : null;

if (httpServer !== null ) httpServer.listen(httpPort);
if (httpsServer !== null ) httpsServer.listen(httpsPort);


console.log("Running UnsafeEntry");
console.log("---");