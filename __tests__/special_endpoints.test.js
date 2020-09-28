/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

const app = require('../main_server.js')
const supertest = require('supertest')
const request = supertest(app)

const validReferers = ['/entry', '/qr', '/se/qr'];
// Parse

validReferers.forEach( function(element, index) {
  it('Testing pass entry endpoint ' + element, async done => {
    const res = await request.get('/parse?pipe=se&referer=' + encodeURIComponent(element) + '&nric=S0000005A&phone=12345678&seUrl=https://temperaturepass.ndi-api.gov.sg/login/PROD-T16MC0110C-JUNCTIONNINE-SE')
    expect(res.status).toBe(302);
    done()
  })
});

