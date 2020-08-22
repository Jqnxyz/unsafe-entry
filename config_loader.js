/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

console.log("Loading config");
// JSON Config
const fs = require('fs');
const jsonConfigData = fs.readFileSync('unsafe-config.json');
const unsafeConfig = JSON.parse(jsonConfigData);

const getConfig = () => {
	return unsafeConfig;
}

exports.getConfig = getConfig;
console.log("Loaded Config");