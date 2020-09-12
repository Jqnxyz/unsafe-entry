/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

const util = require('util')
//Config
const configLoader = require('./config_loader.js');
configLoader.setFile('unsafe-config.json');
const unsafeConfig = configLoader.getConfig();

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

function logObject(objectLog) {
	console.log(util.inspect(objectLog, {
		'colors': true
	}));
}

function logRequest(req) {
	if (unsafeConfig['logRequestBasic']) console.log("Request to " + req.url + " at " + getDateString() + ", " + getTimeString());
	if (unsafeConfig['logRequestDetail']) {
		console.log("---REQUEST START---");
		logObject(req);
		console.log("---REQUEST END---");
	}
}

exports.logObject = logObject;
exports.logRequest = logRequest;
exports.getOffsetDateObj = getOffsetDateObj;
exports.getDateString = getDateString;
exports.getTimeString = getTimeString;
