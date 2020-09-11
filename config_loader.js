/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

console.log("Imported Config Loader");
// JSON Config
const fs = require('fs');
jsonLocation = '';

const getConfig = () => {
    jsonConfigData = fs.readFileSync(jsonLocation);
    return JSON.parse(jsonConfigData);
    console.log("Loaded Config : " + jsonLocation);
}

const setFile = (fileLocation) => {
    jsonLocation = fileLocation;
    console.log("Set Config: " + fileLocation);
}

exports.getConfig = getConfig;
exports.setFile = setFile;

