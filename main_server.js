#!/usr/bin/env node
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Tools
const renderers = require('./renderers.js');
const parsers = require('./parsers.js');
const utilities = require('./utilities.js');

// Pipe Destinations
const safeentry = require('./safeentry.js');

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
	renderers.renderBasic("entry", req, res);
});

// Quick scanner

router.get("/qr", (req, res) => {
	utilities.logRequest(req);
	renderers.renderBasic("entry_auto", req, res);
});

// SafeEntry mode

router.get("/se/qr", (req, res) => {
	utilities.logRequest(req);
	renderers.renderBasic("entry_auto_se", req, res);
});

router.get("/se/config", (req, res) => {
	utilities.logRequest(req);
	renderers.renderBasic("config_page", req, res);
});

router.get("/parse", (req, res) => {
	utilities.logRequest(req);
	// Get SE Venue URL
	let seUrl = decodeURIComponent(req.query.seUrl);
	let seClient = parsers.parseGovUrl(seUrl);
	let pipeDestination = null;
	let parseReferer = null;
	// Parse request details
	if (req.query.referer !== undefined) {
		parseReferer = decodeURIComponent(req.query.referer);
	} else {
		parseReferer = "/entry";
	}
	if (req.query.pipe !== undefined) {
		pipeDestination = decodeURIComponent(req.query.pipe);
	}
	if (req.query.phone !== undefined) {
		phNum = decodeURIComponent(req.query.phone);
	}
	if (req.query.nric !== undefined) {
		icNum = decodeURIComponent(req.query.nric);
	}
	console.log("Referer: " + req.query.referer + " Pipe: "+ req.query.pipe + " Phone: " + req.query.phone + " Nric: " + req.query.nric);

	// Receiving Venue details
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

			// Piping
			if (pipeDestination == "se") {
				console.log("Piped to: " + pipeDestination);
				safeentry.checkIn(phNum, icNum, seClient, seVenue);
				res.redirect('/pass/v3/entry?venue=' + seVenue);
			} else {
				res.redirect('/pass/v3/entry?venue=' + seVenue);
			}
		})
		.catch(function (error) {
			console.log(error);
	    	res.redirect(parseReferer);
		})
		.finally(function () {
			console.log("Finished Parse");
		});
	} else {
		console.log("Invalid URL");
    	res.redirect(parseReferer);
	}
});

// Passes

const passes = {
	'latest': 'v3',
	'v1': 'pass',
	'v2': 'pass_v2',
	'v3': 'pass_v3'
};

router.get("/pass/:version/entry", (req, res) => {
	console.log(req.params.version);
	let reqPass = req.params.version;
	if (reqPass === "latest") {
		reqPass = passes['latest'];
	}
	// v3 uses a different date format
	if (reqPass == "v3") {
		renderers.renderPass(passes[reqPass], 1, req, res);
	} else {
		renderers.renderPass(passes[reqPass], 0, req, res);
	}
});

app.use("/", router);

module.exports = app

console.log("Loaded Main Server");
