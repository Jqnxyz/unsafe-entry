/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

const utilities = require('./utilities.js');
const configLoader = require('./config_loader');
configLoader.setFile('unsafe-config.json');
const unsafeConfig = configLoader.getConfig();

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
        domain: unsafeConfig['domain'],
        location: passLocation.toUpperCase(),
        date: dateString,
        time: utilities.getTimeString()
    });
}

function renderBasic(ver, opt = {domain: unsafeConfig['domain']}, req, res) {
    res.render(ver, opt);
}

exports.renderPass = renderPass;
exports.renderBasic = renderBasic;
