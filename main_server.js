#!/usr/bin/env node
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// JSON Config
const configLoader = require('./config_loader.js');
const unsafeConfig = configLoader.getConfig();

// Inspect Util
const util = require('util')

function logRequest(req) {
	if (unsafeConfig['logRequestBasic']) console.log("Request to " + req.url + " at " + getDateString() + ", " + getTimeString()); 
	if (unsafeConfig['logRequestDetail']) {
		console.log("---REQUEST START---");
		console.log("root: " + util.inspect(req, {
			'showProxy': true,
			'colors': true 
		}));
		console.log("---REQUEST END---");
	}
}

//Routing
const express = require("express");
const axios = require('axios');
const app = express();
const path = require("path");
const router = express.Router();

//Date tools
const hrOffset = parseInt(unsafeConfig['utcOffset']);
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function getOffsetDateObj() {
	let currentDate = new Date();
	let offsetUtcMs = currentDate.getTimezoneOffset()*60*1000 >= 0 ? currentDate.getTimezoneOffset()*60*1000 : currentDate.getTimezoneOffset()*60*1000*-1;
	let offsetCustomMs = hrOffset*3600000-offsetUtcMs;
	let passDateObj = new Date(currentDate.getTime()+offsetCustomMs);
	return passDateObj;
}

function getDateString() {
	let passDateObj = getOffsetDateObj();
	let passDate = passDateObj.getDate() + " " + monthNames[passDateObj.getMonth()] + " " + passDateObj.getFullYear(); 
	return passDate;
}

function getTimeString() {
	let passDateObj = getOffsetDateObj();
	let passHours = passDateObj.getHours() > 12 ? passDateObj.getHours()-12 : passDateObj.getHours();
	let passMinutes = passDateObj.getMinutes() >= 10 ? passDateObj.getMinutes() : "0" + passDateObj.getMinutes();
	let passAMPM = passDateObj.getHours() >= 12 ? "PM" : "AM";
	let passTime = passHours + ":" + passMinutes + " " + passAMPM;
	return passTime;
}

//View Engine

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "web/pug_views"));

// Statics
app.use('/assets', express.static('web/assets'));

// Views
router.get("/", (req, res) => {
	logRequest(req);
    res.redirect('/entry');
});
router.get("/entry", (req, res) => {
	logRequest(req);
	res.render("entry");
});

router.get("/parse", (req, res) => {
	logRequest(req);
	let seUrl = decodeURIComponent(req.query.seUrl);
	let seMatch01 = seUrl.match(/^(?:url:)?https\:\/\/www\.safeentry-qr\.gov\.sg\/tenant\/([A-Z0-9-/]+)/);
	let seMatch02 = seUrl.match(/^(?:url:)?https\:\/\/temperaturepass\.ndi-api\.gov\.sg\/login\/([A-Z0-9-/]+)/);
	let seClient = null;
	if (seMatch01 !== null) {
		seClient = seMatch01[1];
	}
	if (seMatch02 !== null) {
		seClient = seMatch02[1];
	}

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
	let passLocation = req.query.venue !== undefined ? req.query.venue : "No parameter";
	logRequest(req);
	res.render("pass",{
  		location: passLocation.toUpperCase(),
  		date: getDateString(),
  		time: getTimeString()
	});
});

router.get("/pass/v2/entry", (req, res) => {
	let passLocation = req.query.venue !== undefined ? req.query.venue : "No parameter";
	logRequest(req);
	res.render("pass_v2",{
  		location: passLocation.toUpperCase(),
  		date: getDateString(),
  		time: getTimeString()
	});
});

app.use("/", router);

module.exports = app

console.log("Loaded Main Server");