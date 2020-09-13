/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

console.log("Imported SafeEntry");

const qs = require('qs')
const axios = require('axios');
const base64 = require('base-64');
const utf8 = require('utf8');
const utilities = require('./utilities.js');

// SafeEntry API endpoint
const seApiPerson = "https://backend.safeentry-qr.gov.sg/api/v2/person";

const checkIn = (phoneNumber, icNumber, clientId, subEntity) => {
    submitData(phoneNumber, icNumber, clientId, subEntity, "checkin");
}

const checkOut = (phoneNumber, icNumber, clientId, subEntity) => {
    submitData(phoneNumber, icNumber, clientId, subEntity, "checkout");
}

const submitBodyCreator = (phoneNumber, icNumber, clientId, subEntity) => {
    // Create phone number body param
    let utfByteEncodedPN = utf8.encode(phoneNumber);
    let b64EncodedPN = base64.encode(utfByteEncodedPN);
    // Create submission body
    let submissionBody = {
        'mobileno': b64EncodedPN,
        'client_id': clientId,
        'subentity': subEntity,
        'hostname': null,
        'mobilenoEncoded': true,
        'sub': icNumber,
        'actionType': 'checkin',
        'subType': 'uinfin',
        'rememberMe': false
    }
    // Log the body
    utilities.logObject(submissionBody);
    return submissionBody;
}

const submitData = (phoneNumber, icNumber, clientId, subEntity, typeCheck) => {
    console.log("---> START Submit SafeEntry <---");
    // Create submission body
    let submissionBody = submitBodyCreator(phoneNumber, icNumber, clientId, subEntity, typeCheck);
    // Submit
    postRequestHandler(submissionBody);
    console.log("---> FINISH Submit SafeEntry <---");
}

function postRequestHandler(body) {
    // Post request
    axios({
        method: 'post',
        url: seApiPerson,
        data: qs.stringify(body),
        headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
    }).then(function (response) {
        postResponseHandler(response);
    })
    .catch(function (error) {
        postResponseHandler(response);
    });
}

function postResponseHandler(response) {
    if (response['status'] == 200) {
        returnData = response['data']['message']['transactionId'];
        console.log(returnData);
    } else {
        returnData = "failed";
        console.log("FAILED: " + response);
    }
}

exports.checkIn = checkIn;
exports.checkOut = checkOut;

// POST https://backend.safeentry-qr.gov.sg/api/v2/person

// mobileno: [b64Enc]
// client_id:PROD-T16MC0110C-JUNCTIONNINE-SE
// subentity:JUNCTIONNINE
// hostname:null
// systemType:safeentry
// mobilenoEncoded:true
// sub:[plaintext NRIC]
// actionType:checkin
// subType:uinfin
// rememberMe:false

/* Notes:
mobileno is b64 encoded

*/
