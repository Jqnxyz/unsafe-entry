#!/usr/bin/env node
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Tools
const renderers = require('./renderers.js');
const parsers = require('./parsers.js');
const utilities = require('./utilities.js');

//Routing
const express = require("express");
const axios = require('axios');
const app = express();
const path = require("path");
const router = express.Router();

//View Engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "web/pug_views"));

// Statics
app.use('/assets', express.static('web/assets'));

// Views
router.get("/", (req, res) => {
	utilities.logRequest(req);
    res.redirect('/entry');
});

router.get("/entry", (req, res) => {
	utilities.logRequest(req);
	res.render("entry");
});

router.get("/qr", (req, res) => {
	utilities.logRequest(req);
	res.render("entry_auto");
});

router.get("/parse", (req, res) => {
	utilities.logRequest(req);
	let seUrl = decodeURIComponent(req.query.seUrl);
	let seClient = parsers.parseGovUrl(seUrl);

	if (seClient !== null) {
		let seBeUrl = "https://backend.safeentry-qr.gov.sg/api/v2/building?client_id="+seClient;
		axios.get(seBeUrl, {
		  	headers: {
		    	'Cache-Control': 'no-cache',
		    	'authority': 'backend.safeentry-qr.gov.sg',
		    	'accept': 'application/json, text/plain, */*',
		    	'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4235.0 Mobile Safari/537.36',
		    	'origin': 'https://www.safeentry-qr.gov.sg',
		    	'sec-fetch-site': 'same-site',
		    	'sec-fetch-mode': 'cors',
		    	'sec-fetch-dest': 'empty',
		    	'referer': 'https://www.safeentry-qr.gov.sg/tenantList/'+seClient,
		    	'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8'
		  	}
		})
		.then(function (response) {
			//console.log(response);
			let seVenue = response.data['venueName'];
			res.redirect('/pass/v2/entry?venue=' + seVenue);
		})
		.catch(function (error) {
			console.log(error);
	    	res.redirect('/entry');
		})
		.finally(function () {
			console.log("Finished Parse");
		});		
	} else {
		console.log("Invalid URL");
    	res.redirect('/entry');
	}
});


router.get("/pass/v1/entry", (req, res) => {
	renderers.renderPass("pass", req, res);
});

router.get("/pass/v2/entry", (req, res) => {
	renderers.renderPass("pass_v2", req, res);
});

app.use("/", router);

module.exports = app

console.log("Loaded Main Server");
