/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Config
const configLoader = require('./config_loader.js');
const unsafeConfig = configLoader.getConfig();

const utilities = require('./utilities.js');
function renderPass(ver, req, res) {
	let passLocation = req.query.venue !== undefined ? req.query.venue : "No parameter";
	utilities.logRequest(req);
	res.render(ver,{
  		location: passLocation.toUpperCase(),
  		date: utilities.getDateString(),
  		time: utilities.getTimeString()
	});
}

exports.renderPass = renderPass;