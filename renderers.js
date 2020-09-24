/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

const utilities = require('./utilities.js');

function renderPass(ver, dateFormat, req, res) {
	let passLocation = req.query.venue !== undefined ? req.query.venue : "No parameter";
	utilities.logRequest(req);
    let dateString = null;
    if (dateFormat == "1") {
        dateString = utilities.getDateString(true);
    } else {
        dateString = utilities.getDateString();
    }
	res.render(ver,{
  		location: passLocation.toUpperCase(),
  		date: dateString,
  		time: utilities.getTimeString()
	});
}

exports.renderPass = renderPass;
