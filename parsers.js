/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

function parseGovUrl(seUrl) {
	let seMatch01 = seUrl.match(/^(?:url:)?https\:\/\/www\.safeentry-qr\.gov\.sg\/tenant\/([A-Z0-9-/]+)/);
	let seMatch02 = seUrl.match(/^(?:url:)?https\:\/\/temperaturepass\.ndi-api\.gov\.sg\/login\/([A-Z0-9-/]+)/);
	let seClient = null;
	if (seMatch01 !== null) {
		seClient = seMatch01[1];
	}
	if (seMatch02 !== null) {
		seClient = seMatch02[1];
	}
	return seClient;
}

exports.parseGovUrl = parseGovUrl;